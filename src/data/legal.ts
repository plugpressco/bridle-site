// Privacy and terms, as data: the pages and their Markdown copies render from
// here, so they always say the same. Facts come from the plugin's readme
// ("External services"), the relay (bridle/worker) and Bridle AI
// (bridle-ai/README.md, migrations/0001_init.sql). Plain words, no dashes.
import { SITE, AI, PRO } from './site';

export type Block = string | { list: string[] } | { table: string[][] };
export type Part = { id: string; title: string; body: Block[] };
export type Doc = { title: [string, string]; lead: string; parts: Part[] };

export const PRIVACY: Doc = {
  title: ['Privacy', 'What reaches us, and what we keep'],
  lead: 'Bridle is a WordPress plugin. Your conversations, contacts and settings live in your own WordPress database, and we can’t see them. This page covers the few places where data reaches PlugPress: the email relay, Bridle AI, Bridle Pro licences and this website.',
  parts: [
    {
      id: 'relay',
      title: 'The email relay',
      body: [
        'When you forward your support address to your Bridle address (ending in @bridle.to), each email passes through our relay on its way to your site. The relay runs on Cloudflare Email Routing and Cloudflare Workers.',
        { list: [
          'What it receives: every email sent to your forwarding address, with its headers, body and attachments (up to 10 MB each and 25 MB in all).',
          'What it does: it reads the email’s parts and posts them straight to your site, signed with a secret that only your site and the relay know. It uses no AI and reads the email for nothing else.',
          'What it keeps: only your inbox registration. That is your site URL, your webhook URL, the inbox code and its secret. Emails are not stored on the relay.',
          'When your site can’t be reached, or an email arrives for an address no site has registered, the relay forwards it to PlugPress’s fallback mailbox so it isn’t lost. We use those emails only to get them to you or to fix delivery, and delete them when that is done.',
        ] },
        'To stop, remove the forwarding rule at your mail host. Switching off or deleting an inbox in Bridle also removes its registration from the relay.',
      ],
    },
    {
      id: 'ai',
      title: 'Bridle AI',
      body: [
        'Bridle AI is optional. It writes drafts and chat answers for sites that haven’t connected their own AI key, and it stays off until you switch it on.',
        { list: [
          'At sign-up: your site URL and the email you enter for receipts. We keep both, with a hash of your site key. The key itself is never stored.',
          'For each answer: the same text an AI provider would get. That is the conversation or chat so far, the contact details Bridle holds for that customer, your agent instructions and snippets, and the passages from your knowledge that match the question.',
          'What happens to it: we pass it to the model (Claude Haiku, by Anthropic) through Cloudflare AI Gateway with logging off, and send the answer back. We don’t store prompts or answers.',
          `What we keep: your site URL, your email, how many answers your site used each month, and your packs. That is what we need to count your ${AI.free} free answers and your credits.`,
          'Payments for packs go through Polar. Polar handles your card; we see the order, never the card.',
        ] },
      ],
    },
    {
      id: 'own',
      title: 'Your own AI provider',
      body: [
        'When you connect your own key in WordPress, prompts go straight from your site to that provider (for example Anthropic, OpenAI or Google). They never pass through PlugPress, and the provider’s own terms apply.',
        'The same is true of the decision model you can add under Settings → Sorting (TypeSafe or Cloudflare Workers AI), Cloudflare Turnstile on your chat, and Gravatar pictures in your Inbox.',
      ],
    },
    {
      id: 'pro',
      title: 'Bridle Pro licences',
      body: [
        'Bridle Pro checks its licence and its updates with updates.plugpress.io. It sends your site URL, the licence key and version numbers. Purchases go through Polar.',
      ],
    },
    {
      id: 'site',
      title: 'This website',
      body: [
        'bridle.to has no analytics and sets no cookies. Our host keeps short request logs for security.',
        { list: [
          'The waitlist: we store your email, which form you used, the page that sent you (when your browser tells us), your browser’s user agent and the date. We use it to email you at launch, and delete it when you ask.',
          'Abuse: we count sign-ups per visitor with a hash of your IP address that changes every day, and keep it for a day.',
          'When Cloudflare Turnstile guards the form, it checks your browser for signs of a bot. Cloudflare’s Turnstile privacy addendum applies.',
        ] },
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
        `Ask for a copy of what we hold about you, or for it to be deleted: email ${SITE.email}. We answer within 30 days.`,
        'For data inside your WordPress, use its own privacy tools (Tools → Export Personal Data and Erase Personal Data). They include Bridle’s conversations, messages and attachments.',
        'For the relay and Bridle AI, PlugPress handles your customers’ messages on your behalf. Email us for a data processing agreement.',
      ],
    },
    {
      id: 'changes',
      title: 'Changes',
      body: [
        'When something changes we update this page and the date at the top. Changes that matter are also noted in the plugin’s changelog.',
      ],
    },
  ],
};

export const TERMS: Doc = {
  title: ['Terms', 'Short, and in plain words'],
  lead: `These terms cover bridle.to, the services PlugPress runs for Bridle (the email relay and Bridle AI) and Bridle Pro licences. Using any of them means you agree to them. Questions go to ${SITE.email}.`,
  parts: [
    {
      id: 'software',
      title: 'The plugins',
      body: [
        'Bridle and Bridle Pro are released under the GNU General Public License, version 2 or later. You may use, change and share the code under that licence. As the licence says, they come as they are, without warranty.',
      ],
    },
    {
      id: 'relay',
      title: 'The email relay',
      body: [
        'The relay is free for sites running Bridle. Use it only for your own support mail, never to send or receive spam or anything unlawful. We may limit or stop an address that harms the service or other people.',
        'We work to keep it running, but we can’t promise it never fails. Keep your original mailbox as the record of your mail.',
      ],
    },
    {
      id: 'ai',
      title: 'Bridle AI',
      body: [
        { list: [
          `Every site gets ${AI.free} answers a month free. Free answers that you don’t use don’t carry over.`,
          'Packs never expire and belong to the site that bought them.',
          'Only answers that pass Bridle’s checks count. The rest are given back.',
          'We may change the model to keep quality and cost in line, and say so in the changelog.',
          'Use Bridle AI through Bridle only. Don’t resell it or call it from anything else.',
        ] },
      ],
    },
    {
      id: 'pro',
      title: 'Bridle Pro',
      body: [
        { list: [
          'A Bridle Pro licence covers all your sites.',
          `Pay-once licences are sold to the first ${PRO.total} customers only. The price goes up as they sell, as shown on the Pro page. They include updates and support for as long as we make Bridle Pro.`,
          'After that, Pro is sold by the year. Yearly licences renew each year until you cancel. If a licence ends, Pro keeps working; it stops getting updates and support.',
          `Each Pro licence comes with ${AI.proGift.toLocaleString('en-US')} Bridle AI answers, once, for one of its sites.`,
        ] },
      ],
    },
    {
      id: 'refunds',
      title: 'Refunds',
      body: [
        `Bridle Pro: a full refund within ${PRO.refundDays} days of buying. Bridle AI packs: a full refund within ${PRO.refundDays} days if you haven’t used them. Email ${SITE.email}.`,
      ],
    },
    {
      id: 'data',
      title: 'Your data',
      body: [
        'Your conversations stay in your WordPress. The privacy page says what the relay and Bridle AI see and keep. You are responsible for telling your own customers how you handle their messages.',
      ],
    },
    {
      id: 'liability',
      title: 'Liability',
      body: [
        'As far as the law allows, PlugPress is not liable for indirect losses, and our total liability is limited to what you paid us in the 12 months before the claim.',
      ],
    },
    {
      id: 'changes',
      title: 'Changes',
      body: [
        'We may update these terms. The date at the top says when. If a change matters to you, we say so in the changelog or by email.',
      ],
    },
  ],
};

// The same document as Markdown, for its .md copy and llms-full.txt.
export function docMd(doc: Doc, updated: string): string {
  const block = (b: Block) =>
    typeof b === 'string'
      ? b
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
    ...doc.parts.map((p) => `## ${p.title}\n\n${p.body.map(block).join('\n\n')}`),
  ].join('\n\n');
}
