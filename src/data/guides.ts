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
      'Run one support chat on all your websites, with every chat in one Inbox. Start with the free chat on your own site, then add the others with Bridle Pro.',
    summary: 'One chat on every site you run. Every chat in one Inbox.',
    lead: 'Got a shop, a docs site and a landing page? Answer all of them from one place.',
    parts: [
      {
        id: 'free',
        title: 'Start on your own site',
        body: [
          'Bridle Chat is free. It answers from your docs, pages and old replies. Not sure? It sends the chat to you.',
          { steps: [
            'Add your own AI key, or turn on Bridle AI in **Settings → Replies**.',
            'Turn on the chat in **Settings → Chat**.',
            'Visit your site. The chat is on every page.',
          ] },
          'Every chat lands in your Inbox, with the page it started on.',
        ],
      },
      {
        id: 'own-site',
        title: 'Why it stays on one site',
        body: [
          'The free chat only works on the site Bridle runs on. So nobody can copy it onto their site and use up your AI answers.',
        ],
      },
    ],
    faq: [
      { q: 'Does the other site need WordPress?', a: 'No. Any site where you can paste one line of code works.' },
      { q: 'I use Turnstile. Anything to change?', a: 'Yes. Add each site to your Turnstile widget in Cloudflare.' },
    ],
    pro: [
      'Bridle Pro adds **Settings → Other sites**. Add a site and paste one line of code on it.',
      { list: [
        'Same chat, same answers.',
        'Every chat lands in the same Inbox, with the site it came from.',
        'Bridle reads up to 200 pages from that site, every day.',
        'Remove a site and its chat goes away.',
      ] },
    ],
  },
  {
    slug: 'knowledge-gaps',
    label: 'Fill your knowledge gaps',
    title: ['Fill your knowledge gaps', 'Turn questions into docs'],
    seo: 'Find and fill knowledge gaps with Bridle',
    description:
      'Bridle only answers from what you wrote. When it can’t answer, it asks you. Here is how to give it more to read, and how Bridle Pro shows what is missing.',
    summary: 'Give it more to read. See what it still can’t answer.',
    lead: 'Bridle only answers from what you wrote. When it can’t, it asks you. Each of those is a doc you haven’t written yet.',
    parts: [
      {
        id: 'sources',
        title: 'What it reads',
        body: [
          'Turn each one on or off in **Settings → Knowledge**:',
          { list: [
            '**Help docs** from Bridle KB',
            '**Pages and posts** on your site',
            '**WooCommerce products**',
            '**Old replies** from your team, with names and emails taken out',
          ] },
          'Add **snippets** for answers you want used word for word.',
        ],
      },
      {
        id: 'unsure',
        title: 'When it isn’t sure',
        body: [
          'Every fact must come from your docs. If one doesn’t, the reply waits for you. Refunds and angry customers always go to you too.',
        ],
      },
      {
        id: 'fill',
        title: 'Fill a gap',
        body: [
          { steps: [
            'Answer the customer yourself.',
            'Write that answer as a doc, or a snippet.',
            'Next time, Bridle answers it.',
          ] },
          'Coming from Intercom, Help Scout or Notion? **Docs → Import** brings your articles over.',
        ],
      },
    ],
    faq: [
      { q: 'Do old replies need setting up?', a: 'No. Your team’s replies count on their own.' },
      { q: 'Can it read a PDF?', a: 'Not yet. Put the text in a doc or a page.' },
    ],
    pro: [
      'Bridle Pro shows what is missing, in **Settings → Insights** and on Home:',
      { list: [
        'Every question it couldn’t answer, grouped and counted.',
        '**Write a doc** starts one for you, with your team’s answer in it.',
        'This week against last week.',
        'A short email every Monday. You can turn it off.',
      ] },
    ],
  },
  {
    slug: 'workflows',
    label: 'Reply on time',
    title: ['Reply on time', 'Without watching the Inbox'],
    seo: 'Reply on time with Bridle',
    description:
      'Keep support moving with Bridle: replies ready to send, Auto for the easy ones, and with Bridle Pro, reminders, auto-close and who gets each new email.',
    summary: 'Replies ready to send, and a nudge when someone waits.',
    lead: 'Most slow replies happen because nobody saw the email. Bridle does the first part for you.',
    parts: [
      {
        id: 'free',
        title: 'What happens on its own',
        body: [
          { list: [
            '**A quick hello.** Each inbox can tell people you got their email.',
            '**Replies ready.** Bridle writes a reply to every customer email.',
            '**Auto.** Turn it on and Bridle sends the replies it is sure of, after 15 minutes. You can stop it.',
            '**Chat alerts.** Get an email when a chat needs you.',
            '**Trash empties itself** after 30 days.',
          ] },
        ],
      },
      {
        id: 'team',
        title: 'With a team',
        body: [
          'Invite your team in **Settings → Team**. Give a conversation to someone from its header.',
        ],
      },
    ],
    faq: [
      { q: 'Will Auto send something wrong?', a: 'It only sends replies where every fact checks out, and waits 15 minutes first. Money and angry customers always wait for you.' },
    ],
    pro: [
      'Bridle Pro adds **Settings → Workflows**:',
      { list: [
        '**Late replies.** One email to the team when someone waits too long.',
        '**Auto-close.** A quiet conversation closes after the days you pick. A reply opens it again.',
        '**Who gets new mail.** One person, or everyone in turn.',
      ] },
      'Business hours are in [live chat](/guides/live-chat/).',
    ],
  },
  {
    slug: 'store-lookups',
    label: 'Answer order questions',
    title: ['Answer order questions', 'From your own store'],
    seo: 'Answer order questions with Bridle',
    description:
      '“Where is my order?” is one of the most common support emails. Bridle answers it from your own store. Bridle Pro adds orders, tracking and licences.',
    summary: '“Where is my order?” answered from your store.',
    lead: '“Where is my order?” and “Is my licence still good?” come in every day. The answer is already in your store.',
    parts: [
      {
        id: 'free',
        title: 'Free, with WooCommerce',
        body: [
          'Next to each email, Bridle shows the customer’s orders: how many, how much, and the last one.',
          'Bridle reads it too. It also reads your products when **WooCommerce products** is on in **Settings → Knowledge**.',
        ],
      },
      {
        id: 'safe',
        title: 'Kept safe',
        body: [
          'Order details only go into email replies, for the person who wrote. In the chat anyone can type any email, so Bridle doesn’t look them up there.',
        ],
      },
    ],
    faq: [
      { q: 'Can it change orders or give refunds?', a: 'No. It only reads. Refunds always go to you.' },
    ],
    pro: [
      'Bridle Pro adds **Settings → Store**:',
      { list: [
        '**WooCommerce:** the last 5 orders, items and tracking numbers.',
        '**Easy Digital Downloads:** orders and licences.',
        '**Polar** and **Freemius:** orders, plans and licences.',
        'Licence keys only show their last 4 characters.',
      ] },
    ],
  },
  {
    slug: 'live-chat',
    label: 'Answer chats live',
    title: ['Answer chats live', 'Or say when you’re back'],
    seo: 'Live chat and business hours in Bridle',
    description:
      'When Bridle Chat can’t answer, a person takes over by email and in the chat. With Bridle Pro you answer live while they are still there, with business hours.',
    summary: 'Jump into a chat while they are still there.',
    lead: 'When the chat can’t answer, it passes the person to you. Here is what happens next.',
    parts: [
      {
        id: 'free',
        title: 'Free, today',
        body: [
          { steps: [
            'The visitor leaves an email. Bridle tells them how fast you usually reply.',
            'They get a copy of the chat. You get an email that a chat needs you.',
            'You reply from your Inbox. They see it in the chat, or by email if they left.',
          ] },
        ],
      },
    ],
    faq: [
      { q: 'Do they have to stay on the page?', a: 'No. If they leave, your reply goes to their email.' },
    ],
    pro: [
      'Bridle Pro adds **Settings → Live chat**:',
      { list: [
        'When you have Bridle open, you can answer right in the chat. No email needed.',
        'Both sides see when the other is typing.',
        '**Business hours.** When you are closed, the chat says when you’re back.',
      ] },
    ],
  },
];

export const GUIDES_INDEX = {
  path: '/guides/',
  title: 'Bridle guides: answer support with Bridle',
  description:
    'Short guides for doing support with Bridle in WordPress: chat on more sites, filling gaps in your docs, replying on time, order questions and live chat.',
  lead: 'One support job each. What free Bridle does, how to set it up, and what Pro adds.',
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
    `## With Bridle Pro\n\n${g.pro.map(block).join('\n\n')}\n\nPricing: ${site}/pricing/`,
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
