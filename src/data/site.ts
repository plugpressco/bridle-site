// One place for facts that show up on more than one page. Change a number here
// and every page, its Markdown copy, llms.txt and the JSON-LD follow.
// Prices and plans: ~/Workspace/bridle/planning/BRIDLE-PRO.md §11 (decided by
// Fahim, 2 November 2026).

export const SITE = {
  name: 'Bridle',
  url: 'https://bridle.to',
  // The same sentence everywhere: home, llms.txt, the JSON-LD.
  definition:
    'Bridle is an AI support agent for WordPress. It answers support email and website chat from your own docs and past replies, and hands the hard ones to you.',
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
  url: `https://playground.wordpress.net/?blueprint-url=${encodeURIComponent(DEMO_BLUEPRINT)}`,
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

// Bridle Pro. Founders' lifetime for the first 200 licences, a new price every
// 50, then yearly. Nothing is sold until launch.
export const PRO = {
  total: 200,
  step: 50,
  refundDays: 30,
  plans: [
    { key: 'solo', label: '1 site', sites: 1, lifetime: [79, 99, 119, 139], yearly: 79 },
    { key: 'business', label: '5 sites', sites: 5, lifetime: [149, 179, 209, 239], yearly: 149 },
    { key: 'agency', label: 'Unlimited sites', sites: 0, lifetime: [299, 349, 399, 449], yearly: 299 },
  ],
  features: [
    { title: 'Chat on your other sites', text: 'Paste one script tag on any site, WordPress or not. Every chat lands in the same Inbox, tagged by site.' },
    { title: 'Take over a chat live', text: 'See who is chatting right now and answer them yourself, while they are still on the page.' },
    { title: 'Order and licence lookups', text: 'The agent reads the customer’s orders and licences before it answers their email: WooCommerce, Easy Digital Downloads, Polar and Freemius.' },
    { title: 'What it couldn’t answer', text: 'Questions the agent had to hand over, grouped by topic, each with a button to write the missing doc.' },
  ],
};

export const money = (n: number) => '$' + n.toLocaleString('en-US');
export const count = (n: number) => n.toLocaleString('en-US');
