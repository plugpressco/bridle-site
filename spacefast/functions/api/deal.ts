// GET /api/deal: Bridle Pro's live price. Counts paid Bridle Pro orders on
// Polar (cached for 60 seconds) and answers
// { state, sold, total, price, from, to, left, next, live }.
// state: open (pay once) or closed (all 170 sold: Pro is yearly now).
// Without the Space variables it answers live: false and the page keeps the
// first step it was built with.
//
// Space variables: POLAR_TOKEN (secret, scopes orders:read and
// checkouts:write), POLAR_ORG_ID, POLAR_PRODUCT_ID. The steps come from
// src/data/deal.json (put in by scripts/postbuild.mjs).

type Env = Record<string, string | undefined>;
type Step = { price: number; from: number; to: number };
const DEAL = /*DEAL_JSON*/ null as unknown as { total: number; steps: Step[] };

let cache: { at: number; sold: number } | null = null;

async function countSold(env: Env): Promise<number> {
  if (cache && Date.now() - cache.at < 60_000) return cache.sold;
  const url = new URL('/v1/orders/', env.POLAR_API || 'https://api.polar.sh');
  url.searchParams.set('organization_id', env.POLAR_ORG_ID || '');
  url.searchParams.set('product_id', env.POLAR_PRODUCT_ID || '');
  url.searchParams.append('status', 'paid');
  url.searchParams.append('status', 'partially_refunded');
  url.searchParams.set('limit', '1');
  const res = await fetch(url, { headers: { Authorization: `Bearer ${(env.POLAR_TOKEN || '').trim()}`, Accept: 'application/json' } });
  if (!res.ok) throw new Error(`polar ${res.status} ${(await res.text()).slice(0, 120)}`);
  const body = (await res.json()) as { pagination: { total_count: number } };
  cache = { at: Date.now(), sold: body.pagination.total_count };
  return cache.sold;
}

function dealAt(sold: number) {
  const i = DEAL.steps.findIndex((s) => sold < s.to);
  const step = i >= 0 ? DEAL.steps[i] : DEAL.steps[DEAL.steps.length - 1];
  const open = i >= 0 && sold < DEAL.total;
  return {
    state: open ? 'open' : 'closed',
    sold,
    total: DEAL.total,
    price: step.price,
    from: step.from,
    to: step.to,
    left: open ? step.to - sold : 0,
    next: open && DEAL.steps[i + 1] ? DEAL.steps[i + 1].price : null,
  };
}

export async function GET(_request: Request, context: { env: Env }) {
  const env = context.env || {};
  const headers = { 'Cache-Control': 'public, max-age=30' };
  if (!env.POLAR_TOKEN || !env.POLAR_PRODUCT_ID || !env.POLAR_ORG_ID) {
    return Response.json({ ...dealAt(0), live: false, error: 'missing settings' }, { headers });
  }
  try {
    return Response.json({ ...dealAt(await countSold(env)), live: true }, { headers });
  } catch (e) {
    // Say what failed (never the token), so a broken key or scope is easy to spot.
    const why = String((e as Error)?.message || e).replace(/polar_[A-Za-z0-9_]+/g, '[token]').slice(0, 160);
    return Response.json({ ...dealAt(0), live: false, error: why }, { status: 502 });
  }
}
