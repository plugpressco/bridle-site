// GET or POST /api/checkout?plan=5: sends the buyer to a Polar checkout for
// the Bridle licence at the price right now: the Black Friday price until
// endsAt (deal.json), then the regular one. The product stays private on
// Polar, so this is the only way to buy it; each checkout sets the price
// itself (an ad-hoc price). When checkout is switched off (CHECKOUT_OPEN false
// in src/data/site.ts), without POLAR_TOKEN, for an unknown plan or before the
// plan has a Polar product id, it goes back to /pricing/ with the reason in
// ?checkout=.
//
// Space variables: POLAR_TOKEN (secret, scope checkouts:write).

type Env = Record<string, string | undefined>;
type Plan = { key: string; sites: number; base: number; answers: number; inboxes: number; productId: string };
const DEAL = /*DEAL_JSON*/ null as unknown as { after: number; endsAt: string; orgId: string; plans: Plan[] };
const OPEN = /*CHECKOUT_OPEN*/ false;

const back = (request: Request, why = '') =>
  Response.redirect(new URL(`/pricing/${why ? `?checkout=${why}` : ''}#plans`, request.url).toString(), 303);

export async function GET(request: Request, context: { env: Env }) {
  const env = context.env || {};
  const url = new URL(request.url);
  const plan = DEAL.plans.find((p) => p.key === url.searchParams.get('plan')) || (url.searchParams.has('plan') ? undefined : DEAL.plans[0]);
  if (!OPEN || !plan) return back(request);
  if (!env.POLAR_TOKEN || !plan.productId) return back(request, 'soon');

  const offer = Date.now() <= Date.parse(DEAL.endsAt);
  const price = offer ? plan.base : DEAL.after;

  const res = await fetch(new URL('/v1/checkouts/', env.POLAR_API || 'https://api.polar.sh'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${(env.POLAR_TOKEN || '').trim()}`, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      products: [plan.productId],
      prices: { [plan.productId]: [{ amount_type: 'fixed', price_amount: price * 100, price_currency: 'usd' }] },
      allow_discount_codes: false,
      success_url: `${url.origin}/thanks/?checkout_id={CHECKOUT_ID}`,
      return_url: `${url.origin}/pricing/#plans`,
      metadata: { deal: offer ? 'black-friday-2026' : 'regular', plan: plan.key, sites: plan.sites, inboxes: plan.inboxes, answers: plan.answers, price },
    }),
  });
  if (!res.ok) return back(request, 'error');
  const checkout = (await res.json()) as { url: string };
  return Response.redirect(checkout.url, 303);
}

export const POST = GET;
