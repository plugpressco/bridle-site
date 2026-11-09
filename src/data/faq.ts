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

export const PRO_FAQ: QA[] = [
  {
    q: 'What happens after Black Friday?',
    a: `The pay-once deal ends on ${PRO.endsLabel}, or sooner if all ${PRO.total} sell. Then Pro is sold by the year. If you bought once, you keep it.`,
  },
  {
    q: 'Do I keep it forever?',
    a: 'Yes. You pay once and Pro is yours. You get updates and support for as long as we make Bridle Pro.',
  },
  {
    q: 'Can I move it to another site?',
    a: 'Yes. Remove the key from one site and add it to another.',
  },
  {
    q: 'What if my AI answers run out?',
    a: `Top up inside Bridle, from ${money(AI.topUpFrom)}. Or use your own AI key, with no limit.`,
  },
];
