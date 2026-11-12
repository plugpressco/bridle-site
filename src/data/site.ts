// One place for facts that show up on more than one page. Change a number here
// and every page, its Markdown copy, llms.txt and the JSON-LD follow.
// The offer (owner, 12 November 2026): one licence. 5 sites, 10 inboxes, 1,000
// AI answers, one payment. The price goes up as people buy: $99 for buyers 1
// to 50, then $149, $199 and $249, 50 buyers a step. No date.
// The plan, its Polar product id and the steps live in deal.json.
import DEAL_DATA from './deal.json';

export const SITE = {
  name: 'Bridle',
  url: 'https://bridle.to',
  // The same sentence everywhere: home, llms.txt, the JSON-LD.
  definition:
    'Bridle is the help desk that lives in your WordPress: a shared inbox, AI answers, chat and docs in one plugin.',
  // Mail to bridle.to goes through the email relay's catch-all, which hands
  // addresses no site registered to PlugPress's fallback mailbox. Give
  // hello@ its own Email Routing rule before launch.
  email: 'hello@bridle.to',
  // Help and docs live on PlugPress (owner, 2026-11-11). Use support for every
  // "contact us"; keep email only where an address is needed (privacy).
  support: 'https://plugpress.io/support',
  docs: 'https://plugpress.io/docs-category/bridle/',
  company: 'PlugPress',
  companyUrl: 'https://plugpress.io',
  founder: 'Fahim Reza',
  saddle: 'https://saddle.to',
  requires: 'WordPress 7.0+ · PHP 8.1+',
  updated: '12 November 2026',
  // The prices in the cost comparison were read on this day (src/data/cost.ts).
  pricesChecked: '10 November 2026',
};

// The live demo: WordPress Playground in the visitor's browser, set up by the
// blueprint in public/demo/ (Bridle and Bridle KB from their zips, a stand-in
// AI, a stubbed relay, sample mail). Playground fetches it from GitHub, which
// sends the CORS header it needs. Rebuild the zips with each release.
const DEMO_BLUEPRINT = 'https://raw.githubusercontent.com/plugpressco/bridle-site/main/public/demo/blueprint.json';
export const DEMO = {
  blueprint: DEMO_BLUEPRINT,
  url: `https://playground.wordpress.net/?mode=seamless&blueprint-url=${encodeURIComponent(DEMO_BLUEPRINT)}`,
};

// Bridle AI: for sites without their own AI key.
export const AI = {
  free: 100,
  packs: [
    { answers: 1000, price: 10 },
    { answers: 5000, price: 45 },
    { answers: 25000, price: 200 },
  ],
  topUpFrom: 10,
};

// Checkout switch. true: the buy buttons open a Polar checkout at the price
// right now (spacefast/functions/api/checkout.ts). false: they go to /pricing/.
export const CHECKOUT_OPEN = true;
// Bridle's page on WordPress.org (the slug we asked for; check it once the
// plugin is approved).
export const WPORG_URL = 'https://wordpress.org/plugins/bridle/';
// Until WordPress.org approves Bridle (owner, 10 November 2026), the thanks
// page hands buyers the zip from here. A zip install has the same slug, so it
// updates from WordPress.org by itself once Bridle is listed. Set to true then.
export const WPORG_LIVE = false;
export const ZIP_URL = '/download/bridle.zip';
// A buyer's Polar account: the licence key and the download.
export const ACCOUNT_URL = 'https://polar.sh/bridle/portal';
export const FREE_URL = WPORG_LIVE ? WPORG_URL : ZIP_URL;

export type Plan = { key: string; sites: number; answers: number; inboxes: number; productId: string };
// One price step: `price` for buyers up to number `to`. The last step has no
// `to`: it is the regular price.
export type Step = { price: number; to?: number };
export const DEAL: { refundDays: number; orgId: string; steps: Step[]; plans: Plan[] } = DEAL_DATA;

export const money = (n: number) => '$' + n.toLocaleString('en-US');
export const count = (n: number) => n.toLocaleString('en-US');

// The one licence, and its price steps (owner, 12 November 2026: "Steps: 99,
// 149, 199, 249"): the price goes up as people buy, 50 buyers a step. Pages
// are built with the first step. src/scripts/deal.js asks /api/deal, which
// counts paid orders on Polar, and moves an open page to the step of the
// moment; the checkout charges that same step. Rebuild and publish when a step
// sells out, so the static copy follows.
export const PLAN = DEAL.plans[0];
export const STEPS = DEAL.steps;
export const PRICE = STEPS[0].price;
export const NEXT_PRICE = STEPS[1]?.price ?? null;
export const REGULAR = STEPS[STEPS.length - 1].price;
export const OFFER_ON = STEPS.length > 1;
// "$99 for the first 50 buyers. Then $149."
export const RULE = OFFER_ON ? `${money(PRICE)} for the first ${STEPS[0].to} buyers. Then ${money(NEXT_PRICE!)}.` : '';
// "$99 once for the first 50 buyers. Then $149." or "$249 once."
export const PRICE_LINE = OFFER_ON ? `${money(PRICE)} once for the first ${STEPS[0].to} buyers. Then ${money(NEXT_PRICE!)}.` : `${money(PRICE)} once.`;
// Every step in one sentence: "$99 for buyers 1 to 50, $149 for buyers 51 to 100, $199 for buyers 101 to 150, then $249."
export const LADDER = STEPS.map((st, i) => (st.to ? `${money(st.price)} for buyers ${(STEPS[i - 1]?.to ?? 0) + 1} to ${st.to}` : `then ${money(st.price)}`)).join(', ') + '.';
export const BUY_URL = CHECKOUT_OPEN ? `/api/checkout?plan=${PLAN.key}` : '/pricing/#plans';

// Inboxes per site on the Bridle mail service: without a licence, and with one.
export const INBOXES = { free: 3, licence: PLAN.inboxes };
