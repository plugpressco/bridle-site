// GET /api/deal: Bridle Pro's live prices. Counts paid orders across all
// three Bridle Pro products on Polar (cached for 60 seconds): one counter for
// all of them. Answers
// { state, sold, total, step, from, to, left, rise, plans: [{ key, sites, answers, price, next }], live }.
// state: open (pay once) or closed (all 170 sold: Pro is yearly now).
// Without POLAR_TOKEN it answers live: false and the page keeps the first
// prices it was built with.
//
// Space variables: POLAR_TOKEN (secret, scopes orders:read and
// checkouts:write). POLAR_ORG_ID is optional (deal.json has PlugPress's).
// Plans, product ids and steps come from src/data/deal.json (put in by
// scripts/postbuild.mjs).

type Env = Record<string, string | undefined>;
type Step = { from: number; to: number };
type Plan = { key: string; sites: number; base: number; answers: number; productId: string };
const DEAL = /*DEAL_JSON*/ null as unknown as { total: number; rise: number; orgId: string; steps: Step[]; plans: Plan[] };

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
  const i = DEAL.steps.findIndex((s) => sold < s.to);
  const open = i >= 0 && sold < DEAL.total;
  const at = open ? i : DEAL.steps.length - 1;
  const step = DEAL.steps[at];
  const hasNext = open && at + 1 < DEAL.steps.length;
  return {
    state: open ? 'open' : 'closed',
    sold,
    total: DEAL.total,
    step: at,
    from: step.from,
    to: step.to,
    left: open ? step.to - sold : 0,
    rise: DEAL.rise,
    plans: DEAL.plans.map((p) => ({
      key: p.key,
      sites: p.sites,
      answers: p.answers,
      price: p.base + DEAL.rise * at,
      next: hasNext ? p.base + DEAL.rise * (at + 1) : null,
    })),
  };
}

export async function GET(_request: Request, context: { env: Env }) {
  const env = context.env || {};
  const headers = { 'Cache-Control': 'public, max-age=30' };
  if (!env.POLAR_TOKEN) {
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
