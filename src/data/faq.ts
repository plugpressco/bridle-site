// The questions on the home and Pro pages (also their FAQPage JSON-LD and the
// Markdown copies). Short answers, only what Bridle does today.
import { AI, PRO } from './site';

export type QA = { q: string; a: string };

export const FAQ: QA[] = [
  {
    q: 'Is Bridle free?',
    a: `Yes, on WordPress.org with nothing locked. Use your own AI key, or Bridle AI with ${AI.free} free answers a month.`,
  },
  {
    q: 'Can it send replies without me?',
    a: 'Only in Auto, and only replies it is sure of, after a 15-minute hold you can stop. Refunds and upset customers always wait for you.',
  },
  {
    q: 'Where does my data live?',
    a: 'In your own WordPress database. Mail reaches your site through our relay, which keeps nothing but the inbox address.',
  },
  {
    q: 'When can I install it?',
    a: 'Soon, with Bridle Pro on the same day. Join the waitlist and we email you.',
  },
];

export const PRO_FAQ: QA[] = [
  {
    q: 'Does Pro lock anything in Bridle?',
    a: 'No. Free stays complete. Pro only adds.',
  },
  {
    q: 'What does lifetime mean?',
    a: 'Pay once, get updates and support for as long as we make Bridle Pro. Only for the first 200 licences.',
  },
  {
    q: 'Can I get a refund?',
    a: `Yes, within ${PRO.refundDays} days. Just email us.`,
  },
];
