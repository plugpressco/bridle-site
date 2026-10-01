/**
 * POST /api/waitlist — store a waitlist signup in the Space's own MySQL.
 *
 * Accepts JSON (the page's fetch) or a plain form post (no-JS fallback,
 * answered with a 303 to /thanks.html). Duplicate emails and honeypot hits
 * get the same success response, so the endpoint never reveals who signed up.
 */

type Env = { DB: { prepare( sql: string ): { bind( ...values: unknown[] ): { run(): Promise<unknown> }; run(): Promise<unknown> } } };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
let tableReady = false;

async function ensureTable( env: Env ) {
	if ( tableReady ) return;
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
	tableReady = true;
}

function clip( value: unknown, max: number ): string | null {
	if ( typeof value !== 'string' ) return null;
	const v = value.trim();
	return v ? v.slice( 0, max ) : null;
}

export async function POST( request: Request, context: { env: Env } ) {
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

	// Honeypot: bots fill the hidden "website" field. Pretend it worked.
	if ( clip( body.website, 200 ) ) return reply( 200, { ok: true } );

	const email = ( clip( body.email, 254 ) || '' ).toLowerCase();
	if ( ! EMAIL.test( email ) ) return reply( 422, { error: 'Please enter a valid email address.' } );

	try {
		await ensureTable( context.env );
		await context.env.DB.prepare(
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
