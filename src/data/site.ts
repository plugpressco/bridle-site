// One place for facts that show up on more than one page. Change a number here
// and every page, its Markdown copy, llms.txt and the JSON-LD follow.
// Prices: one Bridle Pro plan, decided by Fahim on 9 November 2026 (by
// question): $49 for the first 10, then $20 more every 20 customers, up to
// $199 at licence 170. Then Pro is sold by the year. Steps in deal.json.
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
  proGift: 5000,
};

// Launch switch: false shows "Join the waitlist" on every price button. Set it
// to true on launch day (with the Polar variables on the Space, see README)
// and the buttons open a Polar checkout at the current price.
export const CHECKOUT_OPEN = false;

export type Step = { price: number; from: number; to: number };
export const DEAL: { total: number; refundDays: number; steps: Step[] } = DEAL_DATA;

// What each plan does: an icon, a short name, one short line.
export type Feature = { icon: string; name: string; text: string };

export const FREE_FEATURES: Feature[] = [
  { icon: 'i-inbox', name: 'Sorts your mail', text: 'Spam and receipts go away. People stay.' },
  { icon: 'i-sparkles', name: 'Writes the reply', text: 'From your docs and old replies.' },
  { icon: 'i-check-circle', name: 'Checks every fact', text: 'Not sure? It asks you first.' },
  { icon: 'i-message', name: 'Chat on your site', text: 'Answers visitors right away.' },
  { icon: 'i-book', name: 'Help center', text: 'Your docs, easy to search.' },
  { icon: 'i-key', name: 'Your own AI key', text: `Or ${AI.free} free answers a month.` },
];

export const PRO_FEATURES: Feature[] = [
  { icon: 'i-globe', name: 'Chat on other sites', text: 'One line of code per site.' },
  { icon: 'i-live', name: 'Live chat', text: 'Jump in while they are still there.' },
  { icon: 'i-clock', name: 'Business hours', text: 'Tells people when you are back.' },
  { icon: 'i-bag', name: 'Order lookups', text: 'Reads their orders before it replies.' },
  { icon: 'i-help', name: 'Missing answers', text: 'Shows what it couldn’t answer.' },
  { icon: 'i-history', name: 'Team reminders', text: 'A nudge when someone waits too long.' },
];

// Bridle Pro: one plan, every Pro feature, unlimited sites, pay once.
export const PRO = {
  total: DEAL.total,
  refundDays: DEAL.refundDays,
  steps: DEAL.steps,
  first: DEAL.steps[0],
  features: PRO_FEATURES,
};

export const money = (n: number) => '$' + n.toLocaleString('en-US');
export const count = (n: number) => n.toLocaleString('en-US');
