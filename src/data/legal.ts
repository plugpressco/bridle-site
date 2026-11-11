// Privacy and terms, as data: the pages and their Markdown copies render from
// here, so they always say the same. Facts come from the plugin's readme
// ("External services"), the relay (bridle/worker) and Bridle AI
// (bridle-ai/README.md, migrations/0001_init.sql). Plain words, no dashes.
import { SITE, AI, DEAL, PLAN, INBOXES } from './site';

export type Block = string | { h: string } | { list: string[] } | { table: string[][] };
export type Part = { id: string; title: string; body: Block[] };
export type Doc = { title: [string, string]; lead: string; summary: string[]; parts: Part[] };

// Easy to read (owner, 2026-11-11: "make cleaner simple way read"): an "In
// short" box, then short parts with small headings, short sentences and lists.
// Every fact from the earlier version is still here.
export const PRIVACY: Doc = {
  title: ['Privacy', 'What reaches us, and what we keep'],
  lead: 'Bridle is a WordPress plugin. Your conversations, contacts and settings stay in your own WordPress database. We can’t see them. This page covers the few places where data reaches PlugPress.',
  summary: [
    'Your support mail and chats live in your WordPress, not with us.',
    'The email relay passes mail on to your site. It keeps no emails.',
    'Bridle AI is off until you turn it on. We don’t store prompts or answers.',
    'With your own AI key, nothing passes through us.',
    'bridle.to has no analytics and sets no cookies.',
    `Ask for your data, or ask us to delete it, at ${SITE.email}.`,
  ],
  parts: [
    {
      id: 'relay',
      title: 'The email relay',
      body: [
        'You forward your support address to your Bridle address (it ends in @bridle.to). Each email then passes through our relay on its way to your site. The relay runs on Cloudflare Email Routing and Cloudflare Workers.',
        { h: 'What it receives' },
        'Every email sent to your forwarding address: its headers, body and attachments. Attachments can be up to 10 MB each and 25 MB in all.',
        { h: 'What it does' },
        'It reads the parts of the email and posts them straight to your site. Each post is signed with a secret that only your site and the relay know. It uses no AI, and it reads the email for nothing else.',
        { h: 'What it keeps' },
        'Only your inbox registration:',
        { list: [
          'your site URL',
          'your webhook URL',
          'the inbox code and its secret',
          'a list of each site’s inbox codes, to count them',
        ] },
        'Emails are not stored on the relay.',
        { h: 'With a licence' },
        'Your site also sends its licence key with each registration. The relay checks it with Polar and keeps the answer for a day. It uses it only to set how many inboxes you may have.',
        { h: 'When mail can’t be delivered' },
        'Sometimes your site can’t be reached, or an email comes for an address no site has registered. Then the relay forwards it to PlugPress’s fallback mailbox, so it isn’t lost. We use those emails only to get them to you or to fix delivery. We delete them when that is done.',
        { h: 'How to stop' },
        'Remove the forwarding rule at your mail host. Turning off or deleting an inbox in Bridle also removes its registration from the relay.',
      ],
    },
    {
      id: 'ai',
      title: 'Bridle AI',
      body: [
        'Bridle AI is optional. It writes drafts and chat answers for sites that haven’t connected their own AI key. It stays off until you turn it on.',
        { h: 'When you sign up' },
        'We keep your site URL and the email you enter for receipts. We also keep a hash of your site key. The key itself is never stored.',
        { h: 'For each answer' },
        'We get the same text an AI provider would get:',
        { list: [
          'the conversation or chat so far',
          'the contact details Bridle holds for that customer',
          'your agent instructions and snippets',
          'the parts of your knowledge that match the question',
        ] },
        { h: 'What happens to it' },
        'We pass it to the model (Claude Haiku, by Anthropic) through Cloudflare AI Gateway, with logging off. Then we send the answer back. We don’t store prompts or answers.',
        { h: 'What we keep' },
        { list: [
          'your site URL',
          'your email',
          'how many answers your site used each month',
          'your packs',
        ] },
        `That is what we need to count your ${AI.free} free answers and your credits.`,
        { h: 'Payments' },
        'Packs are paid through Polar. Polar handles your card. We see the order, never the card.',
      ],
    },
    {
      id: 'own',
      title: 'Your own AI provider',
      body: [
        'When you connect your own key in WordPress, prompts go straight from your site to that provider, such as Anthropic, OpenAI or Google. They never pass through PlugPress. The provider’s own terms apply.',
        'The same goes for:',
        { list: [
          'the decision model you can add under Settings → Sorting (TypeSafe or Cloudflare Workers AI)',
          'Cloudflare Turnstile on your chat',
          'Gravatar pictures in your Inbox',
        ] },
      ],
    },
    {
      id: 'pro',
      title: 'Licences',
      body: [
        'Bridle Pro checks its licence and its updates with updates.plugpress.io. It sends your site URL, the licence key and version numbers.',
        'Purchases go through Polar.',
      ],
    },
    {
      id: 'site',
      title: 'This website',
      body: [
        'bridle.to has no analytics and sets no cookies. Our host keeps short request logs for security.',
        { h: 'The waitlist' },
        'We store your email, which form you used, the page that sent you (if your browser tells us), your browser’s user agent and the date. We use it to email you at launch. We delete it when you ask.',
        { h: 'Stopping abuse' },
        'We count sign-ups per visitor with a hash of your IP address. The hash changes every day, and we keep it for a day.',
        { h: 'Bot checks' },
        'When Cloudflare Turnstile guards the form, it checks your browser for signs of a bot. Cloudflare’s Turnstile privacy addendum applies.',
      ],
    },
    {
      id: 'processors',
      title: 'Sub-processors',
      body: [
        'These companies handle data for the services above.',
        { table: [
          ['Who', 'What for', 'What they see'],
          ['Cloudflare', 'The email relay, Bridle AI, Turnstile', 'Emails and AI prompts in transit, inbox registrations, the Bridle AI ledger'],
          ['Anthropic', 'The Bridle AI model', 'Prompts and answers, in transit'],
          ['Polar', 'Payments for Bridle AI packs and Bridle Pro', 'Orders and billing details'],
          ['Spacefast', 'Hosting bridle.to and the waitlist', 'Waitlist entries and request logs'],
        ] },
      ],
    },
    {
      id: 'rights',
      title: 'Your choices',
      body: [
        { h: 'Data we hold' },
        `Ask for a copy of what we hold about you, or ask us to delete it. Email ${SITE.email}. We answer within 30 days.`,
        { h: 'Data in your WordPress' },
        'Use WordPress’s own privacy tools: Tools → Export Personal Data and Erase Personal Data. They include Bridle’s conversations, messages and attachments.',
        { h: 'Data processing agreement' },
        `For the relay and Bridle AI, PlugPress handles your customers’ messages for you. Email ${SITE.email} for a data processing agreement.`,
      ],
    },
    {
      id: 'changes',
      title: 'Changes',
      body: [
        'When something changes, we update this page and the date at the top. We also note changes that matter in the plugin’s changelog.',
      ],
    },
  ],
};

export const TERMS: Doc = {
  title: ['Terms', 'Short, and in plain words'],
  lead: 'These terms cover bridle.to, the services PlugPress runs for Bridle (the email relay and Bridle AI) and Bridle Pro licences. If you use any of them, you agree to these terms.',
  summary: [
    'Bridle and Bridle Pro are GPL. They come as they are, without warranty.',
    `The email relay is free for ${INBOXES.free} inboxes per site. A licence gives ${INBOXES.licence}.`,
    `Every site gets ${AI.free} free AI answers a month. Packs never expire.`,
    'A Bridle licence is paid once. It is not a subscription.',
    `A full refund within ${DEAL.refundDays} days.`,
    `Questions? Ask at ${SITE.support}.`,
  ],
  parts: [
    {
      id: 'software',
      title: 'The plugins',
      body: [
        'Bridle and Bridle Pro are released under the GNU General Public License, version 2 or later. You may use, change and share the code under that licence.',
        'As the licence says, they come as they are, without warranty.',
      ],
    },
    {
      id: 'relay',
      title: 'The email relay',
      body: [
        { list: [
          `It is free for sites running Bridle, for up to ${INBOXES.free} inboxes per site.`,
          `A Bridle licence raises that to ${INBOXES.licence}.`,
          'Inboxes you had before a limit applied keep working.',
        ] },
        { h: 'Fair use' },
        'Use it only for your own support mail. Never use it to send or receive spam or anything unlawful. We may limit or stop an address that harms the service or other people.',
        { h: 'Uptime' },
        'We work to keep it running, but we can’t promise it never fails. Keep your original mailbox as the record of your mail.',
      ],
    },
    {
      id: 'ai',
      title: 'Bridle AI',
      body: [
        { list: [
          `Every site gets ${AI.free} answers a month free. Free answers you don’t use don’t carry over.`,
          'Packs never expire. They belong to the site that bought them.',
          'Only answers that pass Bridle’s checks count. The rest are given back.',
          'We may change the model to keep quality and cost in line. We say so in the changelog.',
          'Use Bridle AI through Bridle only. Don’t resell it or call it from anything else.',
        ] },
      ],
    },
    {
      id: 'pro',
      title: 'The Bridle licence',
      body: [
        { list: [
          `A Bridle licence covers ${PLAN.sites} sites. It turns on the Bridle Pro plugin.`,
          'You pay once. The price is the one on the pricing page on the day you buy.',
          'Pay-once licences include updates and support for as long as we make Bridle Pro.',
        ] },
        { h: 'If a licence can’t be checked' },
        'Bridle keeps working. Only updates stop until the licence is checked again.',
        { h: 'AI answers' },
        `Each licence comes with ${PLAN.answers.toLocaleString('en-US')} Bridle AI answers, once. You can buy more as packs.`,
      ],
    },
    {
      id: 'refunds',
      title: 'Refunds',
      body: [
        { list: [
          `A Bridle licence: a full refund within ${DEAL.refundDays} days of buying.`,
          `Bridle AI packs: a full refund within ${DEAL.refundDays} days, if you haven’t used them.`,
        ] },
        `Ask at ${SITE.support}.`,
      ],
    },
    {
      id: 'data',
      title: 'Your data',
      body: [
        'Your conversations stay in your WordPress. The privacy page says what the relay and Bridle AI see and keep.',
        'You are responsible for telling your own customers how you handle their messages.',
      ],
    },
    {
      id: 'liability',
      title: 'Liability',
      body: [
        'As far as the law allows:',
        { list: [
          'PlugPress is not liable for indirect losses.',
          'Our total liability is limited to what you paid us in the 12 months before the claim.',
        ] },
      ],
    },
    {
      id: 'changes',
      title: 'Changes',
      body: [
        'We may update these terms. The date at the top says when.',
        'If a change matters to you, we tell you in the changelog or by email.',
      ],
    },
  ],
};

// The same document as Markdown, for its .md copy and llms-full.txt.
export function docMd(doc: Doc, updated: string): string {
  const block = (b: Block) =>
    typeof b === 'string'
      ? b
      : 'h' in b
        ? `### ${b.h}`
        : 'list' in b
        ? b.list.map((l) => `- ${l}`).join('\n')
        : [
            '| ' + b.table[0].join(' | ') + ' |',
            '|' + ' --- |'.repeat(b.table[0].length),
            ...b.table.slice(1).map((r) => '| ' + r.join(' | ') + ' |'),
          ].join('\n');
  return [
    `# ${doc.title[0]}`,
    `Last updated ${updated}.`,
    doc.lead,
    `**In short**\n\n${doc.summary.map((l) => `- ${l}`).join('\n')}`,
    ...doc.parts.map((p) => `## ${p.title}\n\n${p.body.map(block).join('\n\n')}`),
  ].join('\n\n');
}
