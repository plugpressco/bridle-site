// Each page's title, description and Markdown copy, used by the HTML pages,
// their .md copies, llms.txt and llms-full.txt. Keep each Markdown copy in
// step with its page: it must say the same thing, in the same plain words.
import { SITE, AI, PRO, DEMO, LAUNCHED, WPORG_URL, money, count, priceAt, sitesLabel, type Feature } from './site';
import { RIVALS, PEOPLE, CHECKED, monthly, money as cents } from './cost';
import { FAQ, PRO_FAQ, type QA } from './faq';
import { PRIVACY, TERMS, docMd } from './legal';
import { GUIDES, GUIDES_INDEX, guideMd, guidesIndexMd } from './guides';

const qa = (list: QA[]) => list.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n');
const feats = (list: Feature[]) => list.map((f) => `- **${f.name}.** ${f.text}`).join('\n');
const plans = PRO.plans.map((p) => `- **${sitesLabel(p.sites)}:** ${money(p.base)}, pay once, with ${count(p.answers)} AI answers.`).join('\n');
const ladder = PRO.steps.map((st, i) => `- Sales ${st.from} to ${st.to}: ${PRO.plans.map((p) => money(priceAt(p, i))).join(' / ')}`).join('\n');
const waitlist = LAUNCHED
  ? `Get Bridle free on WordPress.org: ${WPORG_URL}`
  : `Bridle is coming to WordPress.org soon. Join the waitlist at ${SITE.url}/#join and we’ll email you the day it’s on WordPress.org.`;
const at300 = monthly(300);
const costLines = [`- Bridle, with Bridle AI: ${cents(at300.bridle)} a month`, ...RIVALS.map((r) => `- ${r.name} ${r.plan}: ${cents(at300[r.key])} a month (${r.source})`)].join('\n');
const counted = `${PEOPLE} people, billed yearly. Prices checked on ${CHECKED} on each company’s pricing page: Help Scout Standard ($25 a person, $0.75 per AI answer), Intercom Essential ($29 a person, $0.99 per AI answer), Zendesk Suite Team ($55 a person, $1.50 to $2.00 per AI answer). Bridle counts one Bridle AI answer as $0.01 after the ${AI.free} free each month.`;

export type PageInfo = { path: string; title: string; description: string; md: string };

export const PAGES: Record<string, PageInfo> = {
  home: {
    path: '/',
    title: 'Bridle: AI support agent for WordPress',
    description:
      'Bridle answers your support email and site chat from your own docs, checks every fact and hands the hard ones to you. Free for WordPress.',
    md: `# Your support email answers itself. You check the hard ones.

AI support agent for WordPress. Bridle writes each reply from your docs, checks every fact and hands you the ones it can’t answer.

${waitlist}

Built by the team behind Saddle (${SITE.saddle}).

## Every email comes with a reply.

Read it, then send it.

- **Ready to send.** Replies wait for you, already written.
- **Knows your business.** It reads your docs, pages, products and past replies.
- **Sorts your mail.** Receipts go to Updates. Scams go to Spam.
- **Chat on your site.** It answers visitors from the same docs.

## It checks before it speaks.

No fact without a source.

Every quote and link must match your docs. If one doesn’t, the reply waits for you.

Refunds, billing and upset customers always go to you.

## About a cent an answer.

Or free with your own AI key.

Other help desks charge up to $2 each time their AI answers, plus a price per person.

At 300 AI answers a month, for ${PEOPLE} people:

${costLines}

${counted}

## Start in three steps.

1. **Install Bridle.** Free from WordPress.org.
2. **Forward your support email.** Keep your address. We show you how.
3. **Turn on chat.** One switch adds it to your site.

## Pay once for Bridle Pro.

Only until Cyber Monday. Pro adds chat on your other sites, live chat with your hours, and order and licence lookups. ${money(PRO.plans[0].base)}, pay once, for 1 site. The price goes up ${money(PRO.rise)} every 20 sales. ${PRO.refundDays}-day refund. All plans: ${SITE.url}/pricing/

## A note from the founder.

“Every day we answer the same questions by email. So we built Bridle for our own inbox.” It writes the reply. We check it and send it. Bridle is free, and it stays free. Fahim Reza, founder, PlugPress (${SITE.email})

## Questions, answered.

${qa(FAQ)}

## Links

- Live demo: ${SITE.url}/demo/
- Bridle Chat: ${SITE.url}/chat/
- Pricing: ${SITE.url}/pricing/
- Guides: ${SITE.url}/guides/
- Privacy: ${SITE.url}/privacy/
- Made by ${SITE.company} (${SITE.companyUrl}), the team behind Saddle (${SITE.saddle}). Email: ${SITE.email}
`,
  },
  demo: {
    path: '/demo/',
    title: 'Bridle live demo: try it in your browser',
    description:
      'Try Bridle right in your browser. A sample inbox with replies ready to send, and a chat to ask. Nothing to install. It’s gone when you close the tab.',
    md: `# Try Bridle in your browser

Nothing to install. Ready in about 30 seconds.

Open the demo: ${DEMO.url}

## Three things to try

1. **Home.** Four replies, ready to send.
2. **Inbox.** Open one. Press Send.
3. **Chat.** Ask the chat a question.

## Good to know

- The AI here is a stand-in. It answers from the demo’s docs.
- The sample mail is already in.
- Free plugin only. It’s gone when you close the tab.

${waitlist}`,
  },
  chat: {
    path: '/chat/',
    title: 'Bridle Chat: an AI chat for your WordPress site',
    description:
      'A chat for your WordPress site that answers visitors from your own docs. It never guesses, and it sends the hard questions to you. Free in Bridle.',
    md: `# Bridle Chat: a chat that answers from what you wrote

It answers visitors from your docs. The rest come to you. Free in Bridle.

${waitlist}

## How it works

1. **It looks it up.** In your docs, pages and old replies.
2. **It checks.** Not sure? It won’t guess.
3. **It hands off.** Refunds and angry people go to you.

## When you take over

You reply from your Inbox. They get it anywhere.

- **In the chat,** if they are still on your site.
- **Or by email,** if they already left.
- **A real wait time,** based on how fast you reply.

## Already done

- Says it is an AI
- Blocks spam bots
- Your colour, your icon

## With Bridle Pro

${feats(PRO.features.slice(0, 2))}

More: ${SITE.url}/pricing/
`,
  },
  pricing: {
    path: '/pricing/',
    title: 'Bridle pricing: free, or Pro pay once',
    description:
      'Bridle is free. Bridle Pro is pay once until Cyber Monday: $49 for 1 site, $79 for 3, $149 for 10, AI answers included. 30-day refund.',
    md: `# Free to use. Pay once for Pro.

Bridle is free on WordPress.org. Bridle Pro adds more, and until Cyber Monday you pay for it once.

${waitlist}

## Three ways to pay

- **Bridle: $0, free for good.** Sorting, reply drafts, fact checks, Auto, the chat bubble and AI apps. On any number of sites.
- **Bridle AI: ${money(AI.packs[0].price)} for ${count(AI.packs[0].answers)} answers.** For Bridle without your own AI key. The first ${AI.free} answers each month are free. Bigger packs: ${AI.packs.slice(1).map((p) => `${money(p.price)} for ${count(p.answers)}`).join(', ')}. Packs never run out. Buy inside Bridle when you need more.
- **Bridle Pro, pay once (Black Friday).** Everything in Bridle, plus chat on your other sites, live chat, order lookups, missing answers and workflows.

${plans}

## Pay once. Keep it for life.

Until Cyber Monday (Monday, ${PRO.endsLabel}, at 11:59 pm New York time), or until ${PRO.total} are sold. The first ${PRO.first.to} sales at these prices, then all three go up ${money(PRO.rise)} every 20 sales:

${ladder}

Updates and support for life. ${PRO.refundDays}-day refund. After the deal, Pro is sold by the year.

## What you get with Pro.

- **Chat on other sites.** Paste one line on any site. Chats come to this inbox.
- **Live chat.** Jump into a chat while the visitor is still there. Set your hours.
- **Orders and licences.** Replies can say where an order is or if a licence is active. WooCommerce, Easy Digital Downloads, Polar and Freemius.
- **Missing answers.** See what it couldn’t answer. Turn a question into a doc in one click.
- **Workflows.** A nudge when someone waits too long. Quiet chats close by themselves.
- **AI answers included.** ${PRO.plans.map((p) => count(p.answers)).join(', ').replace(/, ([^,]*)$/, ' or $1')} with your plan. Top up from ${money(AI.topUpFrom)}.

## Compare plans.

Everything that answers your customers is free.

| | Bridle | Bridle Pro |
|---|---|---|
| Email: sorting, reply drafts, fact checks, Auto, rewrite and translate | Yes | Yes |
| Chat bubble on this site | Yes | Yes |
| Chat on your other sites | | Yes |
| Live chat and business hours | | Yes |
| Help docs (Bridle KB, free plugin) | Yes | Yes |
| WooCommerce customer card | Yes | Every order and subscription |
| Easy Digital Downloads, Polar and Freemius lookups | | Yes |
| Missing answers, with “write a doc” | | Yes |
| Teammates | As many as you like | As many as you like |
| AI apps (Claude, ChatGPT) over MCP | Yes | Yes |
| Late-reply nudges, auto-resolve, share new mail | | Yes |
| Your own AI key | No limit | No limit |
| Bridle AI answers | ${AI.free} free a month | ${count(PRO.plans[0].answers)} to ${count(PRO.plans[PRO.plans.length - 1].answers)} included |
| Updates | From WordPress.org | For life |
| Support | WordPress.org forum | By email, for life |
| Price | $0 | ${PRO.plans.map((p) => money(p.base)).join(', ').replace(/, ([^,]*)$/, ' or $1')}, once |

## About a cent an answer.

At 300 AI answers a month:

${costLines}

How we counted: ${counted}

## Questions about paying.

${qa(PRO_FAQ)}
`,
  },
  privacy: {
    path: '/privacy/',
    title: 'Privacy: what Bridle’s relay and Bridle AI keep',
    description:
      'What reaches PlugPress when you use Bridle: the email relay, Bridle AI, Pro licences and this website. What each one keeps, and who helps us run them.',
    md: docMd(PRIVACY, SITE.updated),
  },
  terms: {
    path: '/terms/',
    title: 'Terms: Bridle, Bridle AI and Bridle Pro',
    description:
      'The terms for bridle.to, the Bridle email relay, Bridle AI answers and Bridle Pro licences, in plain words: fair use, packs, lifetime licences and refunds.',
    md: docMd(TERMS, SITE.updated),
  },
  guides: {
    path: GUIDES_INDEX.path,
    title: GUIDES_INDEX.title,
    description: GUIDES_INDEX.description,
    md: guidesIndexMd(SITE.url),
  },
  // One entry per guide, keyed guide-{slug}.
  ...Object.fromEntries(
    GUIDES.map((g) => [
      `guide-${g.slug}`,
      { path: `/guides/${g.slug}/`, title: g.seo, description: g.description, md: guideMd(g, SITE.url) },
    ])
  ),
};
