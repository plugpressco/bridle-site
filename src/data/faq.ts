// The questions on the home and Pro pages (also their FAQPage JSON-LD and the
// Markdown copies). Short answers in plain words, only what Bridle does today.
import { AI, PRO, money } from './site';

export type QA = { q: string; a: string };

export const FAQ: QA[] = [
  {
    q: 'Is Bridle free?',
    a: `Yes. Nothing is locked. Use your own AI key, or get ${AI.free} free AI answers a month.`,
  },
  {
    q: 'Can it send replies on its own?',
    a: 'Only if you turn that on, and only when it is sure. Refunds and angry customers always wait for you.',
  },
  {
    q: 'Where does my data live?',
    a: 'In your own WordPress. We only pass your mail along. We don’t keep it.',
  },
  {
    q: 'When can I get it?',
    a: 'Soon. Join the waitlist and we email you on launch day.',
  },
];

const last = PRO.steps[PRO.steps.length - 1];

export const PRO_FAQ: QA[] = [
  {
    q: 'Does Pro take anything away from free?',
    a: 'No. Free stays whole. Pro only adds.',
  },
  {
    q: 'Why does the price go up?',
    a: `The first ${PRO.first.to} buyers pay ${money(PRO.first.price)}. Then it goes up $20 every 20 sales, to ${money(last.price)}. After ${PRO.total} sales, Pro is yearly.`,
  },
  {
    q: 'What does pay once mean?',
    a: 'You pay one time. You get updates and help for as long as we make Bridle Pro.',
  },
  {
    q: 'Can I get my money back?',
    a: `Yes, within ${PRO.refundDays} days. Just email us.`,
  },
];
