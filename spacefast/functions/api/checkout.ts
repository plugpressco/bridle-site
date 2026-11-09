// GET or POST /api/checkout: sends the buyer to a Polar checkout for Bridle
// Pro at the price right now. The product stays private on Polar, so this is
// the only way to buy it; each checkout sets the step's price itself (an
// ad-hoc price). Before launch (CHECKOUT_OPEN false in src/data/site.ts),
// without the Space variables, or after licence 170, it goes back to the
// price on /pro/.
//
// Space variables: POLAR_TOKEN (secret), POLAR_ORG_ID, POLAR_PRODUCT_ID.

type Env = Record<string, string | undefined>;
type Step = { price: number; from: number; to: number };
const DEAL = /*DEAL_JSON*/ null as unknown as { total: number; steps: Step[] };
const OPEN = /*CHECKOUT_OPEN*/ false;

const back = (request: Request, why = '') =>
  Response.redirect(new URL(`/pro/${why ? `?checkout=${why}` : ''}#price`, request.url).toString(), 303);

async function countSold(env: Env): Promise<number> {
  const url = new URL('/v1/orders/', env.POLAR_API || 'https://api.polar.sh');
  url.searchParams.set('organization_id', env.POLAR_ORG_ID || '');
  url.searchParams.set('product_id', env.POLAR_PRODUCT_ID || '');
  url.searchParams.append('status', 'paid');
  url.searchParams.append('status', 'partially_refunded');
  url.searchParams.set('limit', '1');
  const res = await fetch(url, { headers: { Authorization: `Bearer ${(env.POLAR_TOKEN || '').trim()}`, Accept: 'application/json' } });
  if (!res.ok) throw new Error(`polar ${res.status}`);
  return ((await res.json()) as { pagination: { total_count: number } }).pagination.total_count;
}

export async function GET(request: Request, context: { env: Env }) {
  const env = context.env || {};
  if (!OPEN || !env.POLAR_TOKEN || !env.POLAR_PRODUCT_ID || !env.POLAR_ORG_ID) return back(request);

  let sold: number;
  try {
    sold = await countSold(env);
  } catch {
    return back(request, 'error');
  }
  const step = DEAL.steps.find((s) => sold < s.to);
  if (!step || sold >= DEAL.total) return back(request, 'closed');

  const base = new URL(request.url).origin;
  const res = await fetch(new URL('/v1/checkouts/', env.POLAR_API || 'https://api.polar.sh'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${(env.POLAR_TOKEN || '').trim()}`, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      products: [env.POLAR_PRODUCT_ID],
      prices: { [env.POLAR_PRODUCT_ID as string]: [{ amount_type: 'fixed', price_amount: step.price * 100, price_currency: 'usd' }] },
      allow_discount_codes: false,
      success_url: `${base}/thanks/?checkout_id={CHECKOUT_ID}`,
      return_url: `${base}/pro/#price`,
      metadata: { deal: 'bridle-pro-pay-once', step_price: step.price, licences_sold_before: sold },
    }),
  });
  if (!res.ok) return back(request, 'error');
  const checkout = (await res.json()) as { url: string };
  return Response.redirect(checkout.url, 303);
}

export const POST = GET;
