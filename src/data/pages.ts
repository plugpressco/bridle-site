// Each page's title, description and Markdown copy, used by the HTML pages,
// their .md copies, llms.txt and llms-full.txt. Keep each Markdown copy in
// step with its page: it must say the same thing, in the same plain words.
import { SITE, AI, PRO, DEMO, FREE_FEATURES, money, count, type Feature } from './site';
import { FAQ, PRO_FAQ, type QA } from './faq';
import { PRIVACY, TERMS, docMd } from './legal';
import { GUIDES, GUIDES_INDEX, guideMd, guidesIndexMd } from './guides';

const qa = (list: QA[]) => list.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n');
const feats = (list: Feature[]) => list.map((f) => `- **${f.name}.** ${f.text}`).join('\n');
const packs = AI.packs.map((p) => `- ${money(p.price)}: ${count(p.answers)} more answers`).join('\n');
const ladder = PRO.steps.map((st) => `- Buyers ${st.from} to ${st.to}: ${money(st.price)}`).join('\n');
const waitlist = `Bridle is coming to WordPress.org soon. Join the waitlist at ${SITE.url}/#join and we email you on launch day.`;

export type PageInfo = { path: string; title: string; description: string; md: string };

export const PAGES: Record<string, PageInfo> = {
  home: {
    path: '/',
    title: 'Bridle: the AI support agent for WordPress',
    description:
      'Bridle answers your support email and website chat from your own docs, inside WordPress. The hard ones come to you. A free plugin, coming soon.',
    md: `# AI writes the replies. You hold the reins.

${SITE.definition}

${waitlist}

## Every email comes with a reply

Forward your support email to Bridle. Each email shows up in WordPress with a reply ready. You read it. You send it.

## A chat that answers, and calls you when it can’t

- Answers from your docs
- Never guesses
- Sends the hard ones to you

More: ${SITE.url}/chat/

## Works with Claude and ChatGPT

Answer support right from the AI app you use. Nothing sends without you.

## Bridle: free for everyone

${feats(FREE_FEATURES)}

## Bridle Pro: pay once

${feats(PRO.features)}

The first ${PRO.first.to} buyers pay ${money(PRO.first.price)}. Then $20 more every 20 sales. More: ${SITE.url}/pro/

## Questions

${qa(FAQ)}

## Links

- Live demo: ${SITE.url}/demo/
- Bridle Chat: ${SITE.url}/chat/
- Bridle Pro: ${SITE.url}/pro/
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

More: ${SITE.url}/pro/
`,
  },
  pro: {
    path: '/pro/',
    title: 'Bridle Pro: pay once, use it on every site',
    description:
      'Bridle Pro adds live chat, chat on other sites, order lookups and more. One plan for every site. The first 10 buyers pay $49, then it goes up.',
    md: `# Bridle Pro: pay once, use it on every site

Bridle is free. Pro adds more for a growing shop.

${waitlist}

## Six things Pro adds

${feats(PRO.features)}

## The price: early buyers pay less

One plan. Every site. Every Pro feature. Pay once.

The first ${PRO.first.to} buyers pay ${money(PRO.first.price)}. Then the price goes up $20 every 20 sales:

${ladder}

After ${PRO.total} sales, Pro is sold by the year. Every licence comes with ${count(AI.proGift)} Bridle AI answers and a ${PRO.refundDays}-day refund.

## No AI key?

Every site gets ${AI.free} free answers a month. Need more? Buy a pack. Packs have no end date.

${packs}

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
