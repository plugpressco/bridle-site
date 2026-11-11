// Each page's title, description and Markdown copy, used by the HTML pages,
// their .md copies, llms.txt and llms-full.txt. Keep each Markdown copy in
// step with its page: it must say the same thing, in the same plain words.
import { SITE, AI, PRO, INBOXES, DEMO, LAUNCHED, WPORG_URL, WPORG_LIVE, FREE_FROM, money, count, priceAt, sitesLabel, type Feature } from './site';
import { RIVALS, PEOPLE, CHECKED, monthly, money as cents } from './cost';
import { FAQ, PRO_FAQ, type QA } from './faq';
import { PRIVACY, TERMS, docMd } from './legal';
import { GUIDES, GUIDES_INDEX, guideMd, guidesIndexMd } from './guides';

const qa = (list: QA[]) => list.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n');
const feats = (list: Feature[]) => list.map((f) => `- **${f.name}.** ${f.text}`).join('\n');
const plans = PRO.plans.map((p) => `- **${sitesLabel(p.sites)}:** ${money(p.base)}, pay once, with ${count(p.answers)} AI answers.`).join('\n');
const ladder = PRO.steps.map((st, i) => `- Sales ${st.from} to ${st.to}: ${PRO.plans.map((p) => money(priceAt(p, i))).join(' / ')}`).join('\n');
const waitlist = LAUNCHED
  ? WPORG_LIVE
    ? `Get Bridle free on WordPress.org: ${WPORG_URL}`
    : `Download Bridle free: ${SITE.url}/download/bridle.zip`
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

## Pay once for Bridle Pro.

Only until Cyber Monday. Pro adds chat on your other sites, live chat with your hours, and order and licence lookups. ${money(PRO.plans[0].base)}, pay once, for 1 site. The price goes up ${money(PRO.rise)} every 20 sales. ${PRO.refundDays}-day refund. All plans: ${SITE.url}/pricing/

## A note from the founder.

“Every day we answer the same questions by email. So we built Bridle for our own inbox.” It writes the reply. We check it and send it. Bridle is free, and it stays free. Fahim Reza, founder, PlugPress (${SITE.email})

## Questions, answered.

${qa(FAQ)}

## Links

- Live demo: ${SITE.url}/demo/
- Inbox: ${SITE.url}/inbox/
- Bridle Chat: ${SITE.url}/chat/
- Knowledge base: ${SITE.url}/knowledge-base/
- Pricing: ${SITE.url}/pricing/
- Guides: ${SITE.url}/guides/
- Docs: ${SITE.docs}
- Privacy: ${SITE.url}/privacy/
- Made by ${SITE.company} (${SITE.companyUrl}), the team behind Saddle (${SITE.saddle}). Support: ${SITE.support}
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
    md: `# Bridle Chat: answers your visitors now, even at 3 am

Bridle Chat answers from your docs. Anything hard comes to you. Free in Bridle.

${waitlist}

## Answers with proof, not guesses

Every answer comes from your docs, pages and past replies, with its source.

- **Looks it up.** In your docs, pages and old replies.
- **Won’t guess.** Not sure? It says so and hands over.
- **Fits your site.** Your colour and icon. It says it is an AI.

## When it can’t answer, you can

Hard questions come to your Inbox. You reply where they are.

- **In the chat,** if they are still on your site.
- **Or by email,** if they already left.
- **A real wait time,** based on how fast you reply.

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

${WPORG_LIVE ? 'Bridle is free on WordPress.org.' : 'Bridle is free.'} Bridle Pro adds more, and until Cyber Monday you pay for it once.

${waitlist}

## Three ways to pay

- **Bridle: $0, free for good.** Sorting, reply drafts, fact checks, Auto, the chat bubble and AI apps. On any number of sites, with ${INBOXES.free} inboxes each.
- **Bridle AI: ${money(AI.packs[0].price)} for ${count(AI.packs[0].answers)} answers.** For Bridle without your own AI key. The first ${AI.free} answers each month are free. Bigger packs: ${AI.packs.slice(1).map((p) => `${money(p.price)} for ${count(p.answers)}`).join(', ')}. Packs never run out. Buy inside Bridle when you need more.
- **Bridle Pro, pay once (Black Friday).** Everything in Bridle, plus chat on your other sites, live chat, order lookups, missing answers and workflows.

${plans}

## Pay once. Keep it for life.

Until Cyber Monday (Monday, ${PRO.endsLabel}, at 11:59 pm New York time), or until ${PRO.total} are sold. The first ${PRO.first.to} sales at these prices, then all three go up ${money(PRO.rise)} every 20 sales:

${ladder}

Updates and support for life. ${PRO.refundDays}-day refund. After the deal, Pro is sold by the year.

## What Pro adds.

- **Chat on other sites.** Paste one line on any site. Chats come to this inbox.
- **Live chat.** Jump into a chat while the visitor is still there. Set your hours.
- **Orders and licences.** Replies can say where an order is or if a licence is active. WooCommerce, Easy Digital Downloads, Polar and Freemius.
- **Missing answers.** See what it couldn’t answer. Turn a question into a doc in one click.
- **Workflows.** A nudge when someone waits too long. Quiet chats close by themselves.
- **AI answers included.** ${PRO.plans.map((p) => count(p.answers)).join(', ').replace(/, ([^,]*)$/, ' or $1')} with your plan. Top up from ${money(AI.topUpFrom)}.
- **More inboxes.** 10, 25 or unlimited with your plan.

## Compare plans.

Everything that answers your customers is free.

| | Bridle | Bridle Pro |
|---|---|---|
| Inboxes on the Bridle mail service | ${INBOXES.free} per site | 10, 25 or unlimited |
| Email: sorting, drafts, fact checks, Auto, rewrite | Yes | Yes |
| Chat bubble on this site | Yes | Yes |
| Help docs (Bridle KB, free plugin) | Yes | Yes |
| AI apps (Claude, ChatGPT) over MCP | Yes | Yes |
| Teammates and your own AI key | No limit | No limit |
| Bridle AI answers | ${AI.free} free a month | ${count(PRO.plans[0].answers)} to ${count(PRO.plans[PRO.plans.length - 1].answers)} included |
| Chat on your other sites | | Yes |
| Live chat and business hours | | Yes |
| Order and licence lookups | WooCommerce card | Every order, plus EDD, Polar, Freemius |
| Missing answers, with “write a doc” | | Yes |
| Late-reply nudges, auto-resolve, share new mail | | Yes |
| Updates and support | ${WPORG_LIVE ? 'WordPress.org' : 'Free, help desk'} | For life, help desk |
| Price | $0 | ${PRO.plans.map((p) => money(p.base)).join(', ').replace(/, ([^,]*)$/, ' or $1')}, once |

## About a cent an answer.

Or free with your own AI key.

Other help desks charge up to $2 each time their AI answers, plus a price per person.

At 300 AI answers a month, for ${PEOPLE} people:

${costLines}

${counted}

## Pay once for Bridle Pro.

Only until Cyber Monday. Pro adds chat on your other sites, live chat with your hours, and order and licence lookups. ${money(PRO.plans[0].base)}, pay once, for 1 site. The price goes up ${money(PRO.rise)} every 20 sales. ${PRO.refundDays}-day refund. All plans: ${SITE.url}/pricing/

## A note from the founder.

“Every day we answer the same questions by email. So we built Bridle for our own inbox.” It writes the reply. We check it and send it. Bridle is free, and it stays free. Fahim Reza, founder, PlugPress (${SITE.email})

## Questions, answered.

${qa(FAQ)}

## Links

- Live demo: ${SITE.url}/demo/
- Inbox: ${SITE.url}/inbox/
- Bridle Chat: ${SITE.url}/chat/
- Knowledge base: ${SITE.url}/knowledge-base/
- Pricing: ${SITE.url}/pricing/
- Guides: ${SITE.url}/guides/
- Docs: ${SITE.docs}
- Privacy: ${SITE.url}/privacy/
- Made by ${SITE.company} (${SITE.companyUrl}), the team behind Saddle (${SITE.saddle}). Support: ${SITE.support}
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
    md: `# Bridle Chat: answers your visitors now, even at 3 am

Bridle Chat answers from your docs. Anything hard comes to you. Free in Bridle.

${waitlist}

## Answers with proof, not guesses

Every answer comes from your docs, pages and past replies, with its source.

- **Looks it up.** In your docs, pages and old replies.
- **Won’t guess.** Not sure? It says so and hands over.
- **Fits your site.** Your colour and icon. It says it is an AI.

## When it can’t answer, you can

Hard questions come to your Inbox. You reply where they are.

- **In the chat,** if they are still on your site.
- **Or by email,** if they already left.
- **A real wait time,** based on how fast you reply.

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

${WPORG_LIVE ? 'Bridle is free on WordPress.org.' : 'Bridle is free.'} Bridle Pro adds more, and until Cyber Monday you pay for it once.

${waitlist}

## Three ways to pay

- **Bridle: $0, free for good.** Sorting, reply drafts, fact checks, Auto, the chat bubble and AI apps. On any number of sites, with ${INBOXES.free} inboxes each.
- **Bridle AI: ${money(AI.packs[0].price)} for ${count(AI.packs[0].answers)} answers.** For Bridle without your own AI key. The first ${AI.free} answers each month are free. Bigger packs: ${AI.packs.slice(1).map((p) => `${money(p.price)} for ${count(p.answers)}`).join(', ')}. Packs never run out. Buy inside Bridle when you need more.
- **Bridle Pro, pay once (Black Friday).** Everything in Bridle, plus chat on your other sites, live chat, order lookups, missing answers and workflows.

${plans}

## Pay once. Keep it for life.

Until Cyber Monday (Monday, ${PRO.endsLabel}, at 11:59 pm New York time), or until ${PRO.total} are sold. The first ${PRO.first.to} sales at these prices, then all three go up ${money(PRO.rise)} every 20 sales:

${ladder}

Updates and support for life. ${PRO.refundDays}-day refund. After the deal, Pro is sold by the year.

## What Pro adds.

- **Chat on other sites.** Paste one line on any site. Chats come to this inbox.
- **Live chat.** Jump into a chat while the visitor is still there. Set your hours.
- **Orders and licences.** Replies can say where an order is or if a licence is active. WooCommerce, Easy Digital Downloads, Polar and Freemius.
- **Missing answers.** See what it couldn’t answer. Turn a question into a doc in one click.
- **Workflows.** A nudge when someone waits too long. Quiet chats close by themselves.
- **AI answers included.** ${PRO.plans.map((p) => count(p.answers)).join(', ').replace(/, ([^,]*)$/, ' or $1')} with your plan. Top up from ${money(AI.topUpFrom)}.
- **More inboxes.** 10, 25 or unlimited with your plan.

## Compare plans.

Everything that answers your customers is free.

| | Bridle | Bridle Pro |
|---|---|---|
| Inboxes on the Bridle mail service | ${INBOXES.free} per site | 10, 25 or unlimited |
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
| Updates | ${WPORG_LIVE ? 'From WordPress.org' : 'Free'} | For life |
| Support | ${WPORG_LIVE ? 'WordPress.org forum' : 'Help desk'} | Help desk, for life |
| Price | $0 | ${PRO.plans.map((p) => money(p.base)).join(', ').replace(/, ([^,]*)$/, ' or $1')}, once |

## About a cent an answer.

At 300 AI answers a month:

${costLines}

How we counted: ${counted}

## Questions about paying.

${qa(PRO_FAQ)}
`,
  },
  inbox: {
    path: '/inbox/',
    title: 'Bridle Inbox: AI email replies for WordPress',
    description:
      'Every support email comes with a reply written from your docs and past emails. Every fact checked. You read it, then send it. Free in Bridle.',
    md: `# Bridle Inbox: every email comes with a reply

Bridle writes replies from your docs and past emails. You check and send. Free in Bridle.

${waitlist}

## Replies that know your business

It reads your docs, pages, products and past replies, then writes the answer.

- **Every fact checked.** Quotes and links are checked before you see the reply.
- **Rewrite or translate.** Change the tone or the language in one click.
- **Auto, when you trust it.** Sure answers send after 15 minutes. You can stop them.

## Only customers in your Inbox

Receipts and newsletters go to Updates. Scams go to Spam.

- **Keep your address.** Forward from Gmail, Outlook or any host.
- **Bring the team.** Add as many teammates as you like. No seat price.
- **Hard ones wait for you.** Refunds, billing and upset customers always wait for a person.

## Work it from Claude or ChatGPT

Your AI app reads the inbox and writes drafts. Sending needs your OK.

## More inboxes? Get Pro

${INBOXES.free} inboxes per site are free. Bridle Pro gives 10, 25 or unlimited inboxes, order lookups and workflows: ${SITE.url}/pricing/
`,
  },
  kb: {
    path: '/knowledge-base/',
    title: 'Bridle KB: a free help center that your AI answers from',
    description:
      'A free help center plugin for WordPress. Customers search it, and Bridle answers your support email and site chat from it. Write each answer once.',
    md: `# Bridle KB: write it once, Bridle answers with it forever

A help center on your site. Customers search it, and Bridle answers from it. Free plugin.

${waitlist}

## A help center people actually use

Clean pages that fit your site, and search on one key.

- **Press / to search.** Find any doc without leaving the page.
- **Your look.** Your theme’s font and your colour.
- **Next to your inbox.** Write and sort docs under the Bridle menu.

## Every doc makes Bridle smarter

Email replies and chat answers come from what you wrote. Add a doc, and the next answer uses it.

## See what it couldn’t answer (Bridle Pro)

Turn a missed question into a doc in one click: ${SITE.url}/pricing/
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
