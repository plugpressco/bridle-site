// Each page's title, description and Markdown copy, used by the HTML pages,
// their .md copies, llms.txt and llms-full.txt. Keep each Markdown copy in
// step with its page: it must say the same thing.
import { SITE, AI, PRO, DEMO, money, count } from './site';
import { FAQ, PRO_FAQ, type QA } from './faq';
import { PRIVACY, TERMS, docMd } from './legal';
import { GUIDES, GUIDES_INDEX, guideMd, guidesIndexMd } from './guides';

const qa = (list: QA[]) => list.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n');
const steps = (p: (typeof PRO.plans)[number]) => p.lifetime.map((n, i) => `${money(n)} for licences ${i * PRO.step + 1} to ${(i + 1) * PRO.step}`).join(', ');
const packs = AI.packs.map((p) => `- ${count(p.answers)} answers: ${money(p.price)}`).join('\n');
const waitlist = `Bridle launches on WordPress.org soon. Join the waitlist at ${SITE.url}/#join and we email you the day it is live.`;

// Free against Pro, row by row (the Pro page's table and its Markdown copy).
export const COMPARE: [string, string, string][] = [
  ['Email agent: sorting, drafts, Draft and Auto', 'Yes', 'Yes'],
  ['Bridle Chat on your site', 'Yes', 'Yes'],
  ['Bridle KB help center', 'Yes', 'Yes'],
  ['AI apps over MCP', 'Yes', 'Yes'],
  ['Your own AI key, unlimited', 'Yes', 'Yes'],
  ['Bridle AI answers', `${AI.free} a month`, `${AI.free} a month, plus ${count(AI.proGift)} once`],
  ['Chat on your other sites', 'No', 'Yes'],
  ['Take over a chat live', 'No', 'Yes'],
  ['Order and licence lookups', 'No', 'Yes'],
  ['What it couldn’t answer', 'No', 'Yes'],
];

export type PageInfo = { path: string; title: string; description: string; md: string };

export const PAGES: Record<string, PageInfo> = {
  home: {
    path: '/',
    title: 'Bridle: the AI support agent for WordPress',
    description:
      'Bridle answers support email and website chat from your own docs and past replies, inside WordPress. You check the hard ones. Free plugin, launching soon.',
    md: `# AI writes the replies. You hold the reins.

${SITE.definition}

Bridle answers your support email and website chat from your docs and past replies. You step in only when it matters.

${waitlist}

## Every email arrives with its answer

Forward your support address to the address Bridle gives you. Each customer email becomes a conversation inside wp-admin, usually with a reply already drafted. You only check the hard ones.

- **Sorted on arrival.** Receipts, newsletters and spam are filed away. Your Inbox only holds customers.
- **Answers from what you know.** Every reply comes from your docs, products and past answers. Nothing made up.
- **Sends when it’s sure.** In Auto, confident answers go out on their own after a 15-minute hold you can stop. Refunds and upset customers wait for you.

## It reads what you already wrote, and checks every fact

A draft is ready only when every quote and link in it is found in your sources. Unsure means no guess. Each source is a switch:

- **Bridle KB:** your help center, a free plugin of its own
- **Pages and posts:** what your site already explains
- **WooCommerce products:** prices, versions and details
- **Past replies:** how you answered before, names removed
- **Snippets and instructions:** your tone and your rules

## A chat bubble that answers, and knows when to call you

- Answers from your docs, pages and past replies
- Shows an answer only when every fact checks out
- Hands refunds, billing and anything unsure to you

Free in Bridle. Switch it on and it shows on every page of your site. More: ${SITE.url}/chat/

## Works with ChatGPT, Claude and Codex. You decide if they can send.

Already work in Claude or ChatGPT? Connect it over MCP and answer support from there. Its drafts land in Bridle, checked the same way. Sending stays off until you allow it for that app.

## Bring your own AI key, or start with Bridle AI

- **Your own key:** connect Anthropic, OpenAI or Google in WordPress. Use it as much as you like, at your provider’s price. Free and unlimited.
- **Bridle AI:** no key needed. Every site gets ${AI.free} answers a month free, then packs that never expire. Only answers that pass Bridle’s checks count.

${packs}

## Free on WordPress.org. Pro when you grow.

Bridle is free forever, with no locked features: the email agent with Draft and Auto, Bridle Chat on your site, the Bridle KB help center, AI apps over MCP, unlimited inboxes and teammates.

Bridle Pro, from ${money(Math.min(...PRO.plans.map((p) => p.lifetime[0])))} once for our first ${PRO.total} customers, adds: ${PRO.features.map((f) => f.title.toLowerCase()).join(', ')}. More: ${SITE.url}/pro/

## Questions

${qa(FAQ)}

## Links

- Bridle Chat: ${SITE.url}/chat/
- Bridle Pro and pricing: ${SITE.url}/pro/
- Privacy: ${SITE.url}/privacy/
- Built by the team behind Saddle: ${SITE.saddle}
- Made by ${SITE.company} (${SITE.companyUrl}). Contact: ${SITE.email}
`,
  },
  demo: {
    path: '/demo/',
    title: 'Bridle live demo: try it in your browser',
    description:
      'Open Bridle in a WordPress that runs in your browser, with a sample support inbox, drafts ready to send and a chat bubble. Nothing to install, nothing kept.',
    md: `# Bridle live demo: try it in your browser

Open Bridle in a WordPress that runs in your browser with WordPress Playground. Nothing to install, and nothing is kept when you close the tab.

Open the demo: ${DEMO.url}

## What to try

- **Home:** four replies ready to send, and one refund that waits for you.
- **Inbox:** open a draft, see the sources it used, press Send. The receipt is already in Updates.
- **Chat:** visit the site and ask the bubble a question.

## What is different from your site

- The AI is a stand-in: it answers with the best matching passage from the demo's docs. With your own key, a real model writes the replies.
- Mail doesn't arrive: the sample emails are already in. On your site you forward your support address to Bridle.
- It shows the free plugin and Bridle KB. Bridle Pro is on the Pro page: ${SITE.url}/pro/

${waitlist}`,
  },
  chat: {
    path: '/chat/',
    title: 'Bridle Chat: an AI chat bubble for WordPress',
    description:
      'A chat bubble that answers visitors from your docs, pages and past replies, checks every fact and hands refunds or anything unsure to a person. Free in Bridle.',
    md: `# Bridle Chat: a chat bubble that answers, from what you already wrote

Visitors ask in their own words. Bridle answers from your docs, pages and past replies, checks every fact, and hands the rest to a person. Bridle Chat is free in Bridle.

${waitlist}

## How it answers

1. **It looks it up.** Bridle KB docs, pages and posts, WooCommerce products and your past replies, with names removed.
2. **It checks itself.** Every quote and link must be in a source. If not, or if it isn’t sure, it doesn’t guess.
3. **It hands off.** Refunds, billing, legal, security and upset visitors go to a person. The visitor leaves an email and the chat lands in your Inbox.

## One conversation, in the bubble and by email

Reply from your Inbox. The visitor sees your reply in the bubble while they are on your site, and by email if they don’t see it within 3 minutes. Bridle promises a reply time from how fast you really answered over the last 7 days.

## Already handled

- Says it is an AI in its header
- Limits per visitor and per site
- Optional Cloudflare Turnstile against bots
- Every chat saved; answered chats file as Resolved
- Your colour and your greeting
- Your own AI key, or Bridle AI

## With Bridle Pro

- **Chat on your other sites.** ${PRO.features[0].text}
- **Take over a chat live.** ${PRO.features[1].text}

More: ${SITE.url}/pro/
`,
  },
  pro: {
    path: '/pro/',
    title: 'Bridle Pro: pricing, founders’ lifetime and AI packs',
    description:
      'Bridle is free. Pro adds chat on your other sites, live takeover, order lookups and unanswered questions. Founders’ lifetime from $79, opening at launch.',
    md: `# Everything in Bridle is free. Pro is for the business around it.

Bridle Pro is a separate plugin. It adds chat on your other sites, live takeover, order lookups and the questions your agent couldn’t answer. It opens on launch day, with a founders’ price for the first ${PRO.total} customers.

${waitlist}

## What Pro adds

${PRO.features.map((f) => `- **${f.title}.** ${f.text}`).join('\n')}

## Founders’ lifetime: pay once, for our first ${PRO.total} customers

Every plan has every Pro feature, updates and support for life, ${count(AI.proGift)} Bridle AI answers and a ${PRO.refundDays}-day refund. The price rises every ${PRO.step} licences.

${PRO.plans.map((p) => `- **${p.label}:** ${steps(p)}`).join('\n')}

After licence ${PRO.total}, lifetime closes for good and Pro is ${PRO.plans.map((p) => `${money(p.yearly)} a year for ${p.label.toLowerCase()}`).join(', ')}.

## Bridle AI: answers by the pack

Every site gets ${AI.free} answers a month free. Packs never expire, and only checked answers count. Your own key, when connected, is always used first.

${packs}

## Free and Pro

| | Bridle (free) | Bridle Pro |
| --- | --- | --- |
${COMPARE.map((r) => `| ${r[0]} | ${r[1]} | ${r[2]} |`).join('\n')}

## Questions

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
