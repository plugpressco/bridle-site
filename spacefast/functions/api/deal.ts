// GET /api/deal: Bridle's price right now, by the server's clock. Answers
// { state, price, after, endsAt }. state: offer (the Black Friday price, until
// endsAt) or regular. The page works this out by itself (src/scripts/deal.js);
// this is here so anything else can ask.
// The plan and the deadline come from src/data/deal.json (put in by
// scripts/postbuild.mjs).

type Plan = { key: string; sites: number; base: number; answers: number; inboxes: number; productId: string };
const DEAL = /*DEAL_JSON*/ null as unknown as { after: number; endsAt: string; plans: Plan[] };

export async function GET() {
  const offer = Date.now() <= Date.parse(DEAL.endsAt);
  return Response.json(
    { state: offer ? 'offer' : 'regular', price: offer ? DEAL.plans[0].base : DEAL.after, after: DEAL.after, endsAt: DEAL.endsAt },
    { headers: { 'Cache-Control': 'public, max-age=30' } },
  );
}
