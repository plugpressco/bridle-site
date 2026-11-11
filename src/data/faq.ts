// The questions on the pricing and Help Scout pages (also their FAQPage
// JSON-LD and the Markdown copies). Only what Bridle does today.
import { DEAL, PLAN, OFFER_ON, money, count } from './site';

export type QA = { q: string; a: string; id?: string };

export const PRICING_FAQ: QA[] = [
  {
    q: 'Is this a subscription?',
    a: 'No. You pay once and Bridle is yours. Updates and support come with it for as long as we make Bridle.',
  },
  ...(OFFER_ON
    ? [{
        q: `What happens after ${DEAL.endsLabel}?`,
        a: `The Black Friday price ends and Bridle costs ${money(DEAL.after)}. If you already bought, nothing changes for you.`,
      }]
    : []),
  {
    q: 'How many sites can I use it on?',
    a: `${PLAN.sites}. Staging and local copies of those sites don’t count.`,
  },
  {
    q: 'What if my AI answers run out?',
    a: 'You can add more inside Bridle. Or connect your own AI key, with no limit.',
  },
  {
    q: 'Can I get my money back?',
    a: `Yes. A full refund within ${DEAL.refundDays} days of buying. Unused AI packs too.`,
  },
  {
    q: 'Who takes the payment?',
    a: 'Polar. They take your card. We only see the order.',
  },
];

export const HS_FAQ: QA[] = [
  {
    q: 'Will Bridle slow my site?',
    a: 'No. Email comes in through Bridle’s mail service, not your web server. Visitors load one 7 KB chat script, and only when chat is on.',
  },
  {
    q: 'Do I need my own AI key?',
    a: `No. Your licence comes with ${count(PLAN.answers)} AI answers. Your own Anthropic, OpenAI or Google key also works, with no limit.`,
  },
  {
    q: 'Is Bridle a subscription?',
    a: 'No. You pay once and it is yours.',
  },
  {
    q: 'Is there a phone app?',
    a: 'Not yet. If you answer support from your phone all day, Help Scout is the better pick today.',
  },
];

export const faqLd = (items: QA[]) => ({
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
