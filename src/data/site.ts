// One place for facts that show up on more than one page. Change a number here
// and every page, its Markdown copy, llms.txt and the JSON-LD follow.
// Prices (Fahim, 9 November 2026): three Bridle Pro licences, 1, 3 and 10
// sites, each with Bridle AI answers, sold to pay once as a Black Friday
// deal. All three go up $20 every 20 sales, counting every Bridle Pro sale
// together. The deal ends at endsAt (Cyber Monday, 11:59 pm New York) or
// after sale 170, whichever comes first; then Pro is yearly. Plans, Polar
// product ids, steps and the end live in deal.json.
import DEAL_DATA from './deal.json';

export const SITE = {
  name: 'Bridle',
  url: 'https://bridle.to',
  // The same sentence everywhere: home, llms.txt, the JSON-LD.
  definition:
    'Bridle is an AI support agent for WordPress. It answers your support email and chat from your own docs. The hard ones come to you.',
  // Mail to bridle.to goes through the email relay's catch-all, which hands
  // addresses no site registered to PlugPress's fallback mailbox. Give
  // hello@ its own Email Routing rule before launch.
  email: 'hello@bridle.to',
  company: 'PlugPress',
  companyUrl: 'https://plugpress.io',
  founder: 'Fahim Reza',
  saddle: 'https://saddle.to',
  requires: 'WordPress 7.0+ · PHP 8.1+',
  updated: '9 November 2026',
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

// Cloudflare Turnstile on the waitlist. Empty = off: the form posts without a
// token and the function skips the check. To turn it on, put the widget's
// site key here AND set TURNSTILE_SECRET and TURNSTILE_HOSTNAMES
// (bridle.to,www.bridle.to) on the Space. With a secret on the Space and no
// key here, every sign-up is refused.
export const TURNSTILE_SITEKEY = '';

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

// Launch switch, one for the whole site: false shows the waitlist (an email
// field and "Join the waitlist") wherever a button would say "Get Bridle
// free" or buy Pro. Set it to true on launch day, once Bridle is live on
// WordPress.org and the Polar variables are on the Space (see README): the
// free buttons then go to WPORG_URL and the Pro buttons open a Polar checkout
// at the current price.
export const CHECKOUT_OPEN = false;
export const LAUNCHED = CHECKOUT_OPEN;
// Bridle's page on WordPress.org (the slug we asked for; check it once the
// plugin is approved).
export const WPORG_URL = 'https://wordpress.org/plugins/bridle/';

export type Step = { from: number; to: number };
export type Plan = { key: string; sites: number; base: number; answers: number; productId: string };
export const DEAL: { total: number; refundDays: number; rise: number; endsAt: string; endsLabel: string; orgId: string; steps: Step[]; plans: Plan[] } = DEAL_DATA;

// A plan's price at step i (0 = the first 10 sales).
export const priceAt = (plan: Plan, i: number) => plan.base + DEAL.rise * i;
export const sitesLabel = (n: number) => (n === 1 ? '1 site' : `${n} sites`);

// What each plan does: an icon, a short name, one short line.
export type Feature = { icon: string; name: string; text: string };

export const PRO_FEATURES: Feature[] = [
  { icon: 'i-globe', name: 'Chat on other sites', text: 'One line of code per site.' },
  { icon: 'i-live', name: 'Live chat', text: 'Jump in while they are still there.' },
  { icon: 'i-clock', name: 'Business hours', text: 'Tells people when you are back.' },
  { icon: 'i-bag', name: 'Order lookups', text: 'Reads their orders before it replies.' },
  { icon: 'i-help', name: 'Missing answers', text: 'Shows what it couldn’t answer.' },
  { icon: 'i-history', name: 'Team reminders', text: 'A nudge when someone waits too long.' },
];

// Bridle Pro: three licences, every Pro feature in each, pay once.
export const PRO = {
  total: DEAL.total,
  refundDays: DEAL.refundDays,
  rise: DEAL.rise,
  endsAt: DEAL.endsAt,
  endsLabel: DEAL.endsLabel,
  steps: DEAL.steps,
  first: DEAL.steps[0],
  plans: DEAL.plans,
  features: PRO_FEATURES,
};

export const money = (n: number) => '$' + n.toLocaleString('en-US');
export const count = (n: number) => n.toLocaleString('en-US');
