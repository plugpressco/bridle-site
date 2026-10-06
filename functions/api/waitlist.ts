/**
 * POST /api/waitlist — store a waitlist signup in the Space's own MySQL.
 *
 * Accepts JSON (the page's fetch) or a plain form post (answered with a 303
 * to /thanks.html). Duplicate emails and bot traps get the same success
 * response, so the endpoint never reveals who signed up or what tripped.
 *
 * Bot defences, cheapest first:
 * 1. Honeypot: bots fill the hidden "website" field.
 * 2. Too fast: the page reports how long it was open; under MIN_MS is a script.
 * 3. Cloudflare Turnstile: the page sends a token; siteverify must say it is
 *    valid, for this action, from an approved hostname (fail closed).
 * 4. Rate limit: at most LIMIT signups per visitor per hour, keyed by a hash
 *    of their IP that changes every day (no raw IPs are stored).
 */

type Row = Record<string, unknown>;
type Stmt = {
	bind( ...values: unknown[] ): Stmt;
	run(): Promise<unknown>;
	all(): Promise<{ results?: Row[] }>;
};
type Env = {
	DB: { prepare( sql: string ): Stmt };
	TURNSTILE_SECRET?: string;
	TURNSTILE_HOSTNAMES?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ACTION = 'waitlist';
const MIN_MS = 1500;
const LIMIT = 5;
let tablesReady = false;

async function ensureTables( env: Env ) {
	if ( tablesReady ) return;
	await env.DB.prepare(
		`CREATE TABLE IF NOT EXISTS waitlist (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
			email VARCHAR(254) NOT NULL,
			source VARCHAR(32) NULL,
			referrer VARCHAR(512) NULL,
			user_agent VARCHAR(255) NULL,
			created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			UNIQUE KEY waitlist_email ( email )
		) DEFAULT CHARSET = utf8mb4`
	).run();
	// One row per verified attempt, for the rate limit. Pruned as it goes.
	await env.DB.prepare(
		`CREATE TABLE IF NOT EXISTS waitlist_hits (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
			ip_hash CHAR(64) NOT NULL,
			created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			KEY waitlist_hits_ip ( ip_hash, created_at )
		) DEFAULT CHARSET = utf8mb4`
	).run();
	tablesReady = true;
}

function clip( value: unknown, max: number ): string | null {
	if ( typeof value !== 'string' ) return null;
	const v = value.trim();
	return v ? v.slice( 0, max ) : null;
}

function clientIp( request: Request ): string {
	const forwarded = ( request.headers.get( 'x-forwarded-for' ) || '' ).split( ',' )[ 0 ].trim();
	return request.headers.get( 'cf-connecting-ip' ) || request.headers.get( 'x-real-ip' ) || forwarded || '';
}

// SHA-256 of the IP salted with today's date: enough to count today's
// attempts, useless for tracking anyone across days.
async function ipHash( ip: string ): Promise<string> {
	const day = new Date().toISOString().slice( 0, 10 );
	const digest = await crypto.subtle.digest( 'SHA-256', new TextEncoder().encode( `${ ip }|${ day }|bridle-waitlist` ) );
	return [ ...new Uint8Array( digest ) ].map( ( b ) => b.toString( 16 ).padStart( 2, '0' ) ).join( '' );
}

// Canonical Turnstile siteverify. Any doubt (no secret, network error,
// wrong action or hostname) is a no.
async function humanVerified( env: Env, token: string | null, ip: string ): Promise<boolean> {
	const hostnames = new Set(
		( env.TURNSTILE_HOSTNAMES || '' ).split( ',' ).map( ( h ) => h.trim() ).filter( Boolean )
	);
	if ( ! env.TURNSTILE_SECRET || ! token || token.length > 2048 || hostnames.size === 0 ) return false;

	try {
		const body = new URLSearchParams( { secret: env.TURNSTILE_SECRET, response: token } );
		if ( ip ) body.set( 'remoteip', ip );
		const r = await fetch( 'https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body,
			signal: AbortSignal.timeout( 10_000 ),
		} );
		if ( ! r.ok ) return false;
		const result = ( await r.json() ) as { success?: boolean; action?: string; hostname?: string };
		return result.success === true && result.action === ACTION && hostnames.has( result.hostname || '' );
	} catch {
		return false;
	}
}

export async function POST( request: Request, context: { env: Env } ) {
	const env = context.env;
	const isJson = ( request.headers.get( 'content-type' ) || '' ).includes( 'application/json' );
	let body: Record<string, unknown> = {};
	try {
		body = isJson ? await request.json() : Object.fromEntries( await request.formData() );
	} catch {
		body = {};
	}

	const reply = ( status: number, payload: Record<string, unknown> ) => {
		if ( isJson ) return Response.json( payload, { status } );
		if ( status < 400 ) return Response.redirect( new URL( '/thanks.html', request.url ).toString(), 303 );
		return new Response( String( payload.error ), { status, headers: { 'content-type': 'text/plain; charset=utf-8' } } );
	};

	// 1. Honeypot. Pretend it worked.
	if ( clip( body.website, 200 ) ) return reply( 200, { ok: true } );

	const email = ( clip( body.email, 254 ) || '' ).toLowerCase();
	if ( ! EMAIL.test( email ) ) return reply( 422, { error: 'Please enter a valid email address.' } );

	// 2. Too fast for a person. Pretend it worked.
	const elapsed = Number( body.elapsed );
	if ( Number.isFinite( elapsed ) && elapsed < MIN_MS ) return reply( 200, { ok: true } );

	// 3. Turnstile.
	const ip = clientIp( request );
	const token = clip( body[ 'cf-turnstile-response' ], 2048 ) || clip( body.token, 2048 );
	if ( ! ( await humanVerified( env, token, ip ) ) ) {
		return reply( 403, {
			error: isJson
				? 'We could not check that you are a person. Please try again.'
				: 'Please turn on JavaScript to join the waitlist.',
		} );
	}

	try {
		await ensureTables( env );

		// 4. Rate limit per visitor.
		if ( ip ) {
			const hash = await ipHash( ip );
			const recent = await env.DB.prepare(
				'SELECT COUNT(*) AS n FROM waitlist_hits WHERE ip_hash = ? AND created_at > ( NOW() - INTERVAL 1 HOUR )'
			).bind( hash ).all();
			if ( Number( recent.results?.[ 0 ]?.n ?? 0 ) >= LIMIT ) {
				return reply( 429, { error: 'Too many sign-ups from your network. Please try again in an hour.' } );
			}
			await env.DB.prepare( 'INSERT INTO waitlist_hits ( ip_hash ) VALUES ( ? )' ).bind( hash ).run();
			await env.DB.prepare( 'DELETE FROM waitlist_hits WHERE created_at < ( NOW() - INTERVAL 1 DAY ) LIMIT 500' ).run();
		}

		await env.DB.prepare(
			'INSERT IGNORE INTO waitlist ( email, source, referrer, user_agent ) VALUES ( ?, ?, ?, ? )'
		).bind(
			email,
			clip( body.source, 32 ),
			clip( body.ref, 512 ),
			clip( request.headers.get( 'user-agent' ), 255 )
		).run();
	} catch ( err ) {
		console.error( 'waitlist insert failed', err instanceof Error ? err.message : String( err ) );
		return reply( 500, { error: 'Something went wrong on our side. Please try again in a minute.' } );
	}

	return reply( 200, { ok: true } );
}
