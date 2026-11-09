// The questions on the home and Pro pages (also their FAQPage JSON-LD and the
// Markdown copies). Short answers, only what Bridle does today.
import { AI, PRO } from './site';

export type QA = { q: string; a: string };

export const FAQ: QA[] = [
  {
    q: 'Is Bridle free?',
    a: `Yes. Bridle is a free plugin on WordPress.org with no locked features. Use your own AI key as much as you like, or Bridle AI with ${AI.free} free answers a month. Bridle Pro is a separate plugin for businesses that want more.`,
  },
  {
    q: 'Where do my conversations live?',
    a: 'In your own WordPress database. Bridle stores conversations, contacts and settings in its own tables on your site, and deleting the plugin keeps them.',
  },
  {
    q: 'How does mail reach Bridle?',
    a: 'You forward your support address to the address Bridle gives you. Our relay passes each email straight to your site and keeps nothing but the inbox registration. Replies go out through your own site’s mailer.',
  },
  {
    q: 'Which AI does it use?',
    a: 'The provider you connect in WordPress, with your own key: Anthropic, OpenAI or Google. Without a key, switch on Bridle AI. Your own key is always used first.',
  },
  {
    q: 'Can it send replies without me?',
    a: 'Only if you set an inbox to Auto. Then it sends the replies it is sure of, after a 15-minute hold you can stop. Refunds, billing, legal, security and upset customers always wait for a person.',
  },
  {
    q: 'Does it work with Gmail, Outlook or Zoho?',
    a: 'Anything that can forward mail works. Bridle never logs in to your mailbox. Setup shows the forwarding steps for your mail host.',
  },
  {
    q: 'When can I install it?',
    a: 'Bridle launches on WordPress.org soon, with Bridle Pro on the same day. Join the waitlist and we email you the day it is live.',
  },
];

export const PRO_FAQ: QA[] = [
  {
    q: 'Does Pro lock anything in Bridle?',
    a: 'No. Everything in the free plugin stays free and complete. Pro adds features through hooks and never turns a free one off.',
  },
  {
    q: 'What happens if I remove Pro?',
    a: 'Nothing is lost. Chats from your other sites stay in your Inbox as conversations, and the free plugin keeps working.',
  },
  {
    q: 'What does lifetime mean?',
    a: 'One payment, then updates and support for as long as we make Bridle Pro. Lifetime is only for the first 200 licences.',
  },
  {
    q: 'Can I get a refund?',
    a: `Yes, a full refund within ${PRO.refundDays} days. Just email us.`,
  },
  {
    q: 'Do Bridle AI answers expire?',
    a: `No. Packs never expire. Every site gets ${AI.free} free answers a month first, and only answers that pass Bridle’s checks count.`,
  },
];
