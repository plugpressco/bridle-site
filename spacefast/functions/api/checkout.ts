// GET or POST /api/checkout?plan=1|3|10: sends the buyer to a Polar checkout
// for that Bridle Pro licence at the price right now. The products stay
// private on Polar, so this is the only way to buy them; each checkout sets
// the step's price itself (an ad-hoc price). The step comes from all Bridle
// Pro sales together. Before launch (CHECKOUT_OPEN false in
// src/data/site.ts), without POLAR_TOKEN, for an unknown plan, or after sale
// 170, it goes back to the prices on /pro/.
//
// Space variables: POLAR_TOKEN (secret). POLAR_ORG_ID is optional.

type Env = Record<string, string | undefined>;
type Step = { from: number; to: number };
type Plan = { key: string; sites: number; base: number; answers: number; productId: string };
const DEAL = /*DEAL_JSON*/ null as unknown as { total: number; rise: number; orgId: string; steps: Step[]; plans: Plan[] };
const OPEN = /*CHECKOUT_OPEN*/ false;

const back = (request: Request, why = '') =>
  Response.redirect(new URL(`/pro/${why ? `?checkout=${why}` : ''}#price`, request.url).toString(), 303);

async function countSold(env: Env): Promise<number> {
  const url = new URL('/v1/orders/', env.POLAR_API || 'https://api.polar.sh');
  url.searchParams.set('organization_id', env.POLAR_ORG_ID || DEAL.orgId);
  for (const plan of DEAL.plans) url.searchParams.append('product_id', plan.productId);
  url.searchParams.append('status', 'paid');
  url.searchParams.append('status', 'partially_refunded');
  url.searchParams.set('limit', '1');
  const res = await fetch(url, { headers: { Authorization: `Bearer ${(env.POLAR_TOKEN || '').trim()}`, Accept: 'application/json' } });
  if (!res.ok) throw new Error(`polar ${res.status}`);
  return ((await res.json()) as { pagination: { total_count: number } }).pagination.total_count;
}

export async function GET(request: Request, context: { env: Env }) {
  const env = context.env || {};
  const url = new URL(request.url);
  const plan = DEAL.plans.find((p) => p.key === url.searchParams.get('plan'));
  if (!OPEN || !env.POLAR_TOKEN || !plan) return back(request);

  let sold: number;
  try {
    sold = await countSold(env);
  } catch {
    return back(request, 'error');
  }
  const i = DEAL.steps.findIndex((s) => sold < s.to);
  if (i < 0 || sold >= DEAL.total) return back(request, 'closed');
  const price = plan.base + DEAL.rise * i;

  const res = await fetch(new URL('/v1/checkouts/', env.POLAR_API || 'https://api.polar.sh'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${(env.POLAR_TOKEN || '').trim()}`, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      products: [plan.productId],
      prices: { [plan.productId]: [{ amount_type: 'fixed', price_amount: price * 100, price_currency: 'usd' }] },
      allow_discount_codes: false,
      success_url: `${url.origin}/thanks/?checkout_id={CHECKOUT_ID}`,
      return_url: `${url.origin}/pro/#price`,
      metadata: { deal: 'bridle-pro-pay-once', plan: plan.key, sites: plan.sites, answers: plan.answers, step_price: price, licences_sold_before: sold },
    }),
  });
  if (!res.ok) return back(request, 'error');
  const checkout = (await res.json()) as { url: string };
  return Response.redirect(checkout.url, 303);
}

export const POST = GET;
