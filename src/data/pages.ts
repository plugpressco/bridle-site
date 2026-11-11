// Each page's title, description and Markdown copy, used by the HTML pages,
// their .md copies, llms.txt and llms-full.txt. Keep each Markdown copy in
// step with its page: it must say the same thing, in the same plain words.
import { SITE, AI, PLAN, DEAL, OFFER_ON, PRICE, PRICE_LINE, DEMO, money, count } from './site';
import { IN_THE_LICENCE, ALSO } from './licence';
import { TOOLS } from '../components/b/tools';
import { RIVALS, PEOPLE, CHECKED, HS_ROWS } from './cost';
import { PRICING_FAQ, HS_FAQ, type QA } from './faq';
import { PRIVACY, TERMS, docMd } from './legal';
import { GUIDES, GUIDES_INDEX, guideMd, guidesIndexMd } from './guides';

const qa = (list: QA[]) => list.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n');
const price = money(PRICE);
const hs = RIVALS[0];
const hsMonthly = money(PEOPLE * hs.seat + 300 * hs.perAnswer);
const buy = `Buy Bridle: ${SITE.url}/pricing/ (${PRICE_LINE}) Try the live demo: ${SITE.url}/demo/`;
const offer = `${OFFER_ON ? `**Black Friday offer: ${price} once.** Until ${DEAL.endsLabel}. After that, ${money(DEAL.after)}.` : `**${price} once.** One payment. Yours for life.`}

One licence. You get:

- ${PLAN.sites} sites
- ${PLAN.inboxes} inboxes
- ${count(PLAN.answers)} AI answers
- All four tools: Inbox, AI answers, Chat, Docs
- Every update, for life
- As many teammates as you like

Why you can trust it:

- **${DEAL.refundDays}-day refund.** Not happy? Get all your money back.
- **Pay once.** No subscription. No fee per person.
- **Open source.** It keeps working, even without updates.
- **Safe payment.** Polar takes your card. We only see the order.`;
const bill = `Help Scout bills every month, by the person and by the answer. Bridle is one payment.

- **Help Scout:** ${hsMonthly} every month. ${PEOPLE} people at ${money(hs.seat)}, and 300 AI answers at $${hs.perAnswer.toFixed(2)}. Paid 12 times a year.
- **Bridle:** ${price} once, for ${PLAN.sites} sites. No charge per person, and ${count(PLAN.answers)} AI answers included.

Help Scout ${hs.plan}, billed yearly, after its 3 free months of AI. It counts resolutions and Bridle counts answers. Read on helpscout.com/pricing, ${CHECKED}.${OFFER_ON ? ` Bridle is ${money(PLAN.base)} until ${DEAL.endsLabel} 2026, then ${money(DEAL.after)}.` : ''}`;
const mcp = `## Run it from Claude or ChatGPT

Bridle works with any app that speaks MCP. Nothing is sent without your OK.

- **Any MCP app.** Claude, ChatGPT, Cursor and others can read your inbox, search your docs and write drafts.
- **Deeper with Saddle.** Add Saddle, our free plugin, and the same app runs your whole site. It writes the missing doc and fixes the page. ${SITE.saddle}`;
const others = (not: string) => `## The other three tools

They come in the same plugin.

${[
  ['inbox', `- **Inbox.** All your support email, inside WordPress. ${SITE.url}/inbox/`],
  ['ai', `- **AI answers.** The answer is written before you open the email. ${SITE.url}/ai-answers/`],
  ['chat', `- **Chat.** Answers visitors on your site, day and night. ${SITE.url}/chat/`],
  ['docs', `- **Docs.** A help center your customers and Bridle both read. ${SITE.url}/docs/`],
].filter(([k]) => k !== not).map(([, line]) => line).join('\n')}`;
const cellMd = (v: string | boolean) => (v === true ? 'Yes' : v === false ? 'No' : v);

export type PageInfo = { path: string; title: string; description: string; md: string };

export const PAGES: Record<string, PageInfo> = {
  home: {
    path: '/',
    title: 'Bridle: the help desk that lives in your WordPress',
    description:
      'Bridle is a help desk plugin for WordPress: a shared inbox, AI answers written from your docs, chat and a help center. Pay once, no fee per person.',
    md: `# The help desk that lives in your WordPress.

Bridle writes the reply to every support email from your own docs. You read it and press Send.

${buy}

- No fee per person
- AI answers included
- Open source
- By the team behind Saddle (${SITE.saddle})

## Four tools. One plugin.

Everything a help desk does, without leaving WordPress.

### Inbox: all your support email, inside WordPress.

- Sorted for you: ready to send, or needs you
- Assign, leave notes, save replies
- Your support address stays the same

${SITE.url}/inbox/

### AI answers: the answer is written before you open the email.

- Written from your docs and past replies
- Every quote and link checked
- Refunds and upset customers wait for you

${SITE.url}/ai-answers/

### Chat: answers visitors on your site, day and night.

- Shows the doc behind each answer
- Hands over to you when it is stuck
- One 7 KB script

${SITE.url}/chat/

### Docs: a help center your customers and Bridle both read.

- Lives on your own site
- Import from Help Scout, Intercom or Notion
- Bridle answers from every page

${SITE.url}/docs/

${mcp}

## Only in WordPress: it already knows your store and your team.

- **The order, next to the email.** No tab to open and no order number to ask for. Works with WooCommerce, EDD, Polar and Freemius.
- **Your WordPress users are your team.** Anyone with a login can answer. There are no seats to buy.
- **Your emails stay on your site.** Not on our servers. Leave any time and keep everything.

## Two people. 300 AI answers.

${bill}

## Switching

- **Coming from Help Scout.** Keep your address. Bring your docs. Forward your support email to Bridle and import your help center in one go. ${SITE.url}/compare/help-scout/
- **Coming from a Gmail inbox.** One inbox for the whole team. Everyone sees who has which email, and what was already said. ${SITE.url}/inbox/

## Pay once. Yours for life.

One licence. Everything is in it.

${offer}
`,
  },
  inbox: {
    path: '/inbox/',
    title: 'Bridle Inbox: a shared inbox inside WordPress',
    description:
      'All your support email inside WordPress. Bridle sorts it, your team shares it, and your support address stays the same. No limit on teammates.',
    md: `# All your support email, inside WordPress.

A shared inbox for your team, in the place you already work.

1. An email comes in
2. Bridle sorts it
3. A reply is ready

${buy}

- No limit on teammates
- Keyboard shortcuts
- Select many, like Gmail
- Trash kept for 30 days

## Sorted before you look.

- Ready to send: a reply is already written
- Needs you: refunds, billing, upset customers
- Receipts go to Updates. Scams go to Spam.

## Work one inbox together.

- Assign an email to a teammate
- Leave a note and mention someone
- Save the replies you send often

## Keep the address your customers know.

- Forward your support address to Bridle
- Customers keep writing where they always did
- Ten inboxes in your licence

${others('inbox')}
`,
  },
  ai: {
    path: '/ai-answers/',
    title: 'Bridle AI answers: replies written from your docs',
    description:
      'Bridle reads each support email, finds the answer in your docs and writes the reply. Every fact is checked. Refunds and upset customers wait for you.',
    md: `# The answer is written before you open the email.

Bridle reads each email, finds the answer in your docs and writes the reply. You read it and press Send.

1. Bridle reads the email
2. It writes from your docs
3. Every fact is checked

${buy}

- ${count(PLAN.answers)} AI answers included
- Your own AI key works too
- Shows where each fact came from
- You can always edit

## Written from what you already wrote.

- Your docs, pages and products
- How your team answered before
- Nothing in your docs? It does not guess.

## The hard ones always wait for you.

- Every quote and link is checked first
- Refunds, billing and upset customers go to you
- They never get an automatic reply

## It can send by itself, when you trust it.

- Off, Draft or Auto, for each inbox
- Auto waits 15 minutes, so you can stop it
- Only replies it is sure about

${mcp}

${others('ai')}
`,
  },
  chat: {
    path: '/chat/',
    title: 'Bridle Chat: an AI chat for your WordPress site',
    description:
      'A chat bubble for your WordPress site that answers visitors from your docs, day and night. When it is stuck, it hands the chat over to you.',
    md: `# Answers visitors on your site, day and night.

A chat bubble that answers from your docs. When it is stuck, it hands over to you.

1. A visitor asks
2. Bridle answers from your docs
3. Stuck? It hands over to you

${buy}

- One 7 KB script
- Works with any theme
- Says it is an AI
- Anyone can ask for a person

## It answers from your docs.

- Shows the doc behind each answer
- Does not guess when your docs are silent
- Follows up by email if they leave

## It hands over when it is stuck.

- The chat lands in your inbox
- You see everything already said
- Answer it like any email

## Jump in live, on every site.

- Live chat while they are still there
- Set your hours. It says when you are back.
- One line of code adds chat to your other sites

${others('chat')}
`,
  },
  docs: {
    path: '/docs/',
    title: 'Bridle Docs: a help center on your WordPress site',
    description:
      'A help center on your own WordPress site. Customers search it, and Bridle answers email and chat from every page. Import from Help Scout or Notion.',
    md: `# A help center your customers and Bridle both read.

Write a doc once. Customers find it, and Bridle answers from it.

1. You write a doc once
2. Bridle reads it
3. Every answer uses it

${buy}

- On your own site
- Search built in
- Sorted into categories
- Import from Help Scout, Intercom or Notion

## Write it once, inside WordPress.

- The editor you already know
- Sort docs into categories
- Drafts stay hidden until you publish

## Bridle answers from every page.

- Email replies name the doc they used
- Chat answers link to it
- Change the doc and the answers follow

## See what is missing.

- A list of questions with no doc yet
- Sorted by how often people ask
- Start the doc from the question

${others('docs')}
`,
  },
  pricing: {
    path: '/pricing/',
    title: 'Bridle pricing: pay once, yours for life',
    description: OFFER_ON
      ? `One Bridle licence: ${PLAN.sites} sites, ${PLAN.inboxes} inboxes and ${count(PLAN.answers)} AI answers. Black Friday offer: ${price} once until ${DEAL.endsLabel}. A ${DEAL.refundDays}-day refund.`
      : `One Bridle licence: ${PLAN.sites} sites, ${PLAN.inboxes} inboxes and ${count(PLAN.answers)} AI answers for one payment of ${price}. No subscription. A ${DEAL.refundDays}-day refund.`,
    md: `# Pay once. Yours for life.

One licence. Everything is in it.

${offer}

Buy Bridle: ${SITE.url}/pricing/

## Every tool is in it

There is no bigger plan.

${IN_THE_LICENCE.map((t) => `- **${TOOLS[t.tool].name}.** ${t.items.join('. ')}.`).join('\n')}

Also in it: ${ALSO}

## Questions about paying

${qa(PRICING_FAQ)}
`,
  },
  helpScout: {
    path: '/compare/help-scout/',
    title: 'Help Scout alternative for WordPress: Bridle',
    description:
      'Bridle is a Help Scout alternative that lives in your WordPress: inbox, chat, docs and AI answers in one plugin. Pay once, with no fee per person.',
    md: `# The Help Scout alternative that lives in WordPress.

Inbox, chat, docs and AI answers in one plugin.

${buy}

- Lives in your WordPress
- No fee per person
- About a cent an AI answer
- Imports your Help Scout Docs

## Two people. 300 AI answers.

${bill}

## Side by side

The rows where Help Scout wins are here too.

| | Help Scout | Bridle |
| --- | --- | --- |
${HS_ROWS.map((r) => `| ${r[0]} | ${cellMd(r[1])} | ${cellMd(r[2])} |`).join('\n')}

## Which one fits you

**Pick Bridle if**

- Your business runs on WordPress
- You answer support yourself, or with a small team
- You want AI answers without a bill for each one

**Pick Help Scout if**

- You have ten or more people answering
- You need a phone app, WhatsApp or Instagram
- You need HIPAA

## Moving from Help Scout

Three steps. Your support address stays the same.

1. **Install Bridle.** It opens inside your WordPress admin, next to your posts and pages.
2. **Forward your support address.** Customers keep writing to the address they know.
3. **Bring your docs.** Bridle imports your Help Scout Docs and answers from them right away.

Old conversations stay in Help Scout. Bridle starts with new email.

## Questions before you switch

${qa(HS_FAQ)}
`,
  },
  demo: {
    path: '/demo/',
    title: 'Bridle live demo: try it in your browser',
    description:
      'Try Bridle right in your browser. A sample inbox with replies ready to send, and a chat to ask. Nothing to install. It’s gone when you close the tab.',
    md: `# Try Bridle in your browser.

Nothing to install. Ready in about 30 seconds.

Open the demo: ${DEMO.url}

## Three things to try

1. **Home.** Four replies, ready to send.
2. **Inbox.** Open one. Press Send.
3. **Chat.** Ask the chat a question.

## Good to know

- The AI here is a stand-in. It answers from the demo’s docs.
- The sample mail is already in.
- The demo has the core tools. Live chat and order lookups need a real site.
- It runs in your browser and is gone when you close the tab.

${buy}
`,
  },
  privacy: {
    path: '/privacy/',
    title: 'Privacy: what Bridle’s relay and Bridle AI keep',
    description:
      'What reaches PlugPress when you use Bridle: the email relay, Bridle AI, licences and this website. What each one keeps, and who helps us run them.',
    md: docMd(PRIVACY, SITE.updated),
  },
  terms: {
    path: '/terms/',
    title: 'Terms: Bridle, Bridle AI and the Bridle licence',
    description:
      'The terms for bridle.to, the Bridle email relay, Bridle AI answers and Bridle licences, in plain words: fair use, packs, lifetime licences and refunds.',
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
