// Guides: how to do one support job with Bridle. Each one is useful on its own
// (what the free plugin does and how to set it up), then says in a few lines
// what Bridle Pro adds. The plugin links here from the screen each guide is
// about, so keep the slugs. Facts come from the plugin's AGENTS.md and
// bridle-pro/README.md. Plain words, sentence case, no dashes.
//
// Inline text may use [label](/path/) links and **bold**; the page renders
// them and the Markdown copy keeps them as they are.
import type { QA } from './faq';

export type GuideBlock = string | { list: string[] } | { steps: string[] };
export type GuidePart = { id: string; title: string; body: GuideBlock[] };
export type Guide = {
  slug: string;
  label: string;
  title: [string, string];
  seo: string;
  description: string;
  summary: string;
  lead: string;
  parts: GuidePart[];
  faq: QA[];
  pro: GuideBlock[];
};

export const GUIDES: Guide[] = [
  {
    slug: 'chat-on-other-sites',
    label: 'Chat on your other sites',
    title: ['Chat on your other sites', 'One Inbox for all of them'],
    seo: 'Chat on your other sites with Bridle',
    description:
      'Run one support chat across several websites from the WordPress site Bridle runs on. How the free chat works on your site, and how Bridle Pro adds the others.',
    summary: 'One chat bubble on every site you run, with every chat in one Inbox.',
    lead: 'Bridle Chat answers visitors on the WordPress site Bridle runs on. If you also run a shop, a docs site or a landing page somewhere else, here is how to answer them all from one place.',
    parts: [
      {
        id: 'free',
        title: 'Start with the chat on your own site',
        body: [
          'Bridle Chat is free. It answers from your Bridle KB docs, pages and posts, WooCommerce products and past replies, checks every fact, and hands anything unsure to a person.',
          { steps: [
            'Connect an AI provider with your own key, or switch on Bridle AI under **Settings → Replies**.',
            'Open **Settings → Chat** and switch on the chat. Pick the inbox chats go to, a greeting and your colour.',
            'Visit your site. The bubble shows on every page.',
          ] },
          'Every chat lands in your Inbox and shows the page the visitor started it on. Answered chats file as Resolved.',
        ],
      },
      {
        id: 'own-site',
        title: 'Why the free chat stays on its own site',
        body: [
          'The chat only answers browsers on the site Bridle runs on. That stops anyone from putting your bubble on their site and spending your AI answers. Its limits per visitor and per site still apply.',
          'Running the same Bridle on every site is the other option, but then each site has its own Inbox, its own knowledge and its own key.',
        ],
      },
    ],
    faq: [
      { q: 'Does the other site need WordPress?', a: 'No. Any site that lets you paste a script tag works: WordPress, Shopify, a static site or an app.' },
      { q: 'I use Turnstile. Anything to change?', a: 'Add each site’s domain to your Turnstile widget in Cloudflare, or the check fails there.' },
    ],
    pro: [
      'Bridle Pro adds **Settings → Other sites**. Add a site’s address and copy one script tag onto that site.',
      { list: [
        'The bubble there is the same Bridle Chat: same answers, same handoff.',
        'Every chat lands in the same Inbox, tagged with the site and the page it came from.',
        'Bridle reads that site’s pages from its sitemap, up to 200, again every day, so the agent can answer from them too.',
        'Remove a site and its bubble stops and its pages are forgotten.',
      ] },
    ],
  },
  {
    slug: 'knowledge-gaps',
    label: 'Fill your knowledge gaps',
    title: ['Fill your knowledge gaps', 'Turn unanswered questions into docs'],
    seo: 'Find and fill knowledge gaps with Bridle',
    description:
      'When Bridle can’t answer, it hands the question to a person instead of guessing. How to give it more to answer from, and how Bridle Pro collects the gaps.',
    summary: 'Give the agent more to answer from, and see what it still can’t.',
    lead: 'Bridle only answers from what you already wrote. When it can’t find the answer, it hands the question to a person. Each of those is a doc you haven’t written yet.',
    parts: [
      {
        id: 'sources',
        title: 'What the agent reads',
        body: [
          'Open **Settings → Knowledge**. Each source is a switch:',
          { list: [
            '**Bridle KB docs:** your help center, a free plugin of its own.',
            '**Pages and posts:** what your site already explains.',
            '**WooCommerce products:** prices, stock and details.',
            '**Past replies:** how your team answered before, with names, emails and order numbers removed.',
          ] },
          'Snippets on the same page are short answers you want used word for word. Your agent instructions, under **Settings → Replies**, set the tone and the rules.',
        ],
      },
      {
        id: 'unsure',
        title: 'When it isn’t sure',
        body: [
          'A draft is ready only when every quote and link in it is found in a source. If not, the draft says why and waits for you. In the chat, the visitor is asked for an email and the chat goes to your Inbox with a note saying what was missing.',
          'Refunds, billing, legal questions and upset customers always go to a person. Those aren’t gaps: they are a person’s job.',
        ],
      },
      {
        id: 'fill',
        title: 'Fill a gap',
        body: [
          { steps: [
            'Answer the customer yourself.',
            'Write the answer as a doc in Bridle KB (**Docs** in Bridle’s menu), or add it as a snippet.',
            'The next person who asks gets it from the agent.',
          ] },
          'Moving from Intercom, Help Scout or Notion? **Docs → Import** brings your articles over as Bridle KB docs.',
        ],
      },
    ],
    faq: [
      { q: 'Do past replies need setting up?', a: 'No. Resolved conversations with a reply from your team count on their own, within the same inbox.' },
      { q: 'Can it answer from a PDF?', a: 'Not yet. Put the text in a doc or a page.' },
    ],
    pro: [
      'Bridle Pro collects the gaps for you in **Settings → Insights** and on Home.',
      { list: [
        'Every question the agent handed over because it wasn’t sure, with similar questions grouped and counted.',
        '**Write a doc** makes a Bridle KB draft titled with the question, filled with your team’s reply with personal details removed.',
        'This week against last: chats answered, chats handed over, drafts written.',
        'A short email every Monday about last week. You can switch it off.',
      ] },
    ],
  },
  {
    slug: 'workflows',
    label: 'Reply on time',
    title: ['Reply on time', 'Without watching the Inbox'],
    seo: 'Support workflows in Bridle',
    description:
      'How to keep support moving with Bridle: drafts that wait for you, Auto for the easy ones, and Bridle Pro reminders, auto-resolve and assignment rules.',
    summary: 'Drafts, Auto and reminders, so nobody waits too long.',
    lead: 'Most support delays are someone not seeing a message in time. Bridle does the first part for you, and leaves the decisions to you.',
    parts: [
      {
        id: 'free',
        title: 'What runs on its own today',
        body: [
          { list: [
            '**Acknowledgement:** each inbox can reply at once that you got the message. Set it in **Settings → Inboxes**.',
            '**Drafts:** in Draft mode the agent writes a reply to every customer email. The Inbox groups them into Ready to send, Sending soon and Needs you.',
            '**Auto:** in Auto mode, a sure and checked answer is sent after a 15-minute hold you can stop. Refunds, billing and upset customers always wait for a person. Choose the mode per inbox in **Settings → Replies**.',
            '**Chat alerts:** **Settings → Chat** can email you when a chat needs a person.',
            '**Trash:** conversations in Trash are deleted for good after 30 days.',
          ] },
        ],
      },
      {
        id: 'team',
        title: 'With a team',
        body: [
          'Invite teammates in **Settings → Team**. Assign a conversation from its header, and each teammate sees their own unread.',
        ],
      },
    ],
    faq: [
      { q: 'Will Auto send something wrong?', a: 'It only sends answers where every fact checked out, and holds each one for 15 minutes so you can stop it. Anything about money, the law or an upset customer waits for you.' },
    ],
    pro: [
      'Bridle Pro adds **Settings → Workflows**:',
      { list: [
        '**Late replies:** once an hour, one email to the team listing everyone who has waited longer than you choose (4 hours to 2 days), each message once.',
        '**Auto-resolve:** a conversation waiting on the customer for 3 to 30 days is resolved with a note. Their reply opens it again.',
        '**Who gets new mail:** per inbox, one teammate or everyone in turn.',
      ] },
      'Business hours and away messages for the chat are in [live chat](/guides/live-chat/).',
    ],
  },
  {
    slug: 'store-lookups',
    label: 'Answer order questions',
    title: ['Answer order questions', 'From your store’s own records'],
    seo: 'Order and licence questions in Bridle',
    description:
      'How Bridle uses your WooCommerce store to answer customers, and how Bridle Pro lets drafts read orders, tracking and licences, from WooCommerce to Polar.',
    summary: 'Where’s my order, is my licence active: answered from your store.',
    lead: '“Where is my order?” and “Is my licence still active?” are some of the most common support emails. The answer is already in your store.',
    parts: [
      {
        id: 'free',
        title: 'With WooCommerce, free',
        body: [
          'When the customer has bought from your WooCommerce store, Bridle shows a card beside the conversation: how many orders, total spent, the last order date and whether they are active or lapsed. One click opens their orders.',
          'The agent reads that card too, and your products (prices, stock and details) when **WooCommerce products** is on in **Settings → Knowledge**.',
        ],
      },
      {
        id: 'safe',
        title: 'Kept safe',
        body: [
          'Store details only go into email drafts, for the address the email came from. In the chat anyone can type anyone’s email, so the agent doesn’t look a visitor up there until they have written to you by email.',
        ],
      },
    ],
    faq: [
      { q: 'Does it change orders or issue refunds?', a: 'No. It only reads. Refunds always go to a person.' },
    ],
    pro: [
      'Bridle Pro adds **Settings → Store** and richer cards the agent can answer from:',
      { list: [
        '**WooCommerce:** the last 5 orders with status, total, items and tracking numbers, and WooCommerce Subscriptions status and renewal date.',
        '**Easy Digital Downloads:** the last 5 orders, and Software Licensing licences with expiry and sites used.',
        '**Polar** and **Freemius:** orders, subscriptions and licences, with a read-only key you add.',
        'Licence keys show their last four characters only.',
      ] },
    ],
  },
  {
    slug: 'live-chat',
    label: 'Answer chats live',
    title: ['Answer chats live', 'Or say when you’re back'],
    seo: 'Live chat and business hours in Bridle',
    description:
      'How a Bridle Chat handoff reaches a person today, by email and in the bubble, and how Bridle Pro lets you answer live while you’re online, with business hours.',
    summary: 'Take over a chat while the visitor is still there.',
    lead: 'When the chat can’t answer, it hands the visitor to a person. Here is what happens next, and how to answer while they are still on the page.',
    parts: [
      {
        id: 'free',
        title: 'A handoff today',
        body: [
          { steps: [
            'The visitor leaves an email. Bridle tells them when you usually reply, from your real first-reply time over the last 7 days.',
            'They get a copy of the chat by email, and you get “A chat needs you” if that’s on in **Settings → Chat**.',
            'You reply from the Inbox like any email. The reply shows in their bubble while they are on your site, and goes by email if they haven’t seen it within 3 minutes.',
          ] },
          'Either way it stays one conversation, in the bubble and by email.',
        ],
      },
    ],
    faq: [
      { q: 'Does the visitor have to stay on the page?', a: 'No. If they leave, your reply reaches them by email in the same thread.' },
    ],
    pro: [
      'Bridle Pro adds **Settings → Live chat**:',
      { list: [
        'While someone on your team has Bridle open, a handoff goes live: no email asked, and the bubble says a person is here.',
        'Replies show at once, and both sides see when the other is typing.',
        '**Business hours:** a weekly schedule in your timezone. Outside it, the chat says when you’re back, with an optional away message.',
      ] },
    ],
  },
];

export const GUIDES_INDEX = {
  path: '/guides/',
  title: 'Bridle guides: answer support with Bridle',
  description:
    'Short guides to answering support with Bridle in WordPress: chat on several sites, knowledge gaps, replying on time, order questions and live chat.',
  lead: 'Short how-tos for one support job each: what Bridle does for it today, how to set it up, and what Bridle Pro adds.',
};

const block = (b: GuideBlock) =>
  typeof b === 'string'
    ? b
    : 'list' in b
      ? b.list.map((l) => `- ${l}`).join('\n')
      : b.steps.map((s, i) => `${i + 1}. ${s}`).join('\n');

// A guide's Markdown copy, from the same data as its page.
export function guideMd(g: Guide, site: string): string {
  return [
    `# ${g.title[0]}`,
    g.lead,
    ...g.parts.map((p) => `## ${p.title}\n\n${p.body.map(block).join('\n\n')}`),
    `## Questions\n\n${g.faq.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n')}`,
    `## With Bridle Pro\n\n${g.pro.map(block).join('\n\n')}\n\nPricing: ${site}/pro/`,
  ]
    .join('\n\n')
    .replace(/\]\(\//g, `](${site}/`);
}

export function guidesIndexMd(site: string): string {
  return [
    '# Guides',
    GUIDES_INDEX.lead,
    ...GUIDES.map((g) => `- [${g.label}](${site}/guides/${g.slug}/): ${g.summary}`),
  ].join('\n\n');
}

// [label](/path/) and **bold** in guide text, as HTML. Everything else is escaped.
export function inline(text: string): string {
  const esc = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  return esc
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\((\/[^)\s]*)\)/g, '<a href="$2">$1</a>');
}
