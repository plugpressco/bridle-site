// GET /api/deal: Bridle's price right now. The price goes up as people buy
// (the steps in src/data/deal.json: $99 for buyers 1 to 50, then $149, $199,
// $249). This counts the licence's paid orders on Polar (cached for 60
// seconds) and answers
// { sold, step, price, next, left, to, regular, live }.
//   step     index of the step of the moment
//   price    what a buyer pays now
//   next     the next step's price, or null on the last step
//   left     buyers left at this price, or null on the last step
//   to       the last buyer number at this price, or null
//   regular  the last step's price
//   live     true when the count came from Polar. Without POLAR_TOKEN, before
//            the licence has a Polar product id, or when Polar does not answer,
//            it is false and the page keeps the first step it was built with.
// src/scripts/deal.js reads this; checkout.ts charges the same step.
//
// Space variables: POLAR_TOKEN (secret, scopes orders:read and
// checkouts:write). POLAR_ORG_ID is optional (deal.json has Bridle's).
// The steps and the product id come from src/data/deal.json (put in by
// scripts/postbuild.mjs).

type Env = Record<string, string | undefined>;
type Step = { price: number; to?: number };
type Plan = { key: string; sites: number; answers: number; inboxes: number; productId: string };
const DEAL = /*DEAL_JSON*/ null as unknown as { orgId: string; steps: Step[]; plans: Plan[] };

let cache: { at: number; sold: number } | null = null;

async function countSold(env: Env): Promise<number> {
  if (cache && Date.now() - cache.at < 60_000) return cache.sold;
  const url = new URL('/v1/orders/', env.POLAR_API || 'https://api.polar.sh');
  url.searchParams.set('organization_id', env.POLAR_ORG_ID || DEAL.orgId);
  for (const plan of DEAL.plans) url.searchParams.append('product_id', plan.productId);
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
  const found = DEAL.steps.findIndex((s) => s.to !== undefined && sold < s.to);
  const at = found < 0 ? DEAL.steps.length - 1 : found;
  const step = DEAL.steps[at];
  const next = DEAL.steps[at + 1];
  return {
    sold,
    step: at,
    price: step.price,
    next: next ? next.price : null,
    left: step.to !== undefined ? step.to - sold : null,
    to: step.to ?? null,
    regular: DEAL.steps[DEAL.steps.length - 1].price,
  };
}

export async function GET(_request: Request, context: { env: Env }) {
  const env = context.env || {};
  const headers = { 'Cache-Control': 'public, max-age=30' };
  if (!env.POLAR_TOKEN || DEAL.plans.some((p) => !p.productId)) {
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
