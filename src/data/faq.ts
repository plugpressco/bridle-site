// The questions on the home and pricing pages (also their FAQPage JSON-LD and
// the Markdown copies). Approved copy: planning/landing/pages/home/08-copy.md
// §8 and pages/pricing/08-copy.md §7. Only what Bridle does today.
import { AI, PRO, money, count } from './site';

export type QA = { q: string; a: string; id?: string };

export const FAQ: QA[] = [
  {
    q: 'Will my customers know it’s an AI?',
    a: 'Yes. The chat says so at the top. Anyone can ask for a person, and the hard questions come to you.',
  },
  {
    q: 'Can it send replies by itself?',
    a: 'Only if you turn on Auto. Then sure answers wait 15 minutes so you can stop them. Refunds, billing, legal questions and upset customers always wait for you.',
  },
  {
    q: 'What if it doesn’t know the answer?',
    a: 'It doesn’t guess. It leaves a note on why and the reply is yours to write. With Pro, these questions become a list of docs to write.',
  },
  {
    q: 'Do I need an AI key?',
    a: `No. Bridle AI gives you ${AI.free} answers a month free, then ${money(AI.packs[0].price)} for ${count(AI.packs[0].answers)}, and packs never run out. Or connect your own key in WordPress and pay your AI company directly.`,
  },
  {
    q: 'Will it slow down my site?',
    a: 'Visitors load one small script, and only when chat is on. Replies are written in the background.',
  },
  {
    q: 'Where is my data kept?',
    a: 'In your WordPress. Mail passes through our relay on the way in, and the relay doesn’t keep it. The AI you choose reads each message to write the reply.',
  },
  {
    id: 'ai-apps',
    q: 'Does it work with Claude or ChatGPT?',
    a: 'Yes. They can read your inbox and write drafts. They can only send if you allow it.',
  },
  {
    q: 'Is there a charge per person?',
    a: 'No. Add teammates as WordPress users, as many as you like.',
  },
];

export const PRO_FAQ: QA[] = [
  {
    q: 'Is this a subscription?',
    a: 'No. During the Black Friday deal you pay once and Pro is yours. You get updates and support for as long as we make Bridle Pro.',
  },
  {
    q: 'What happens after Cyber Monday?',
    a: 'Pay once ends and Pro is sold by the year. If you bought in the deal, nothing changes for you.',
  },
  {
    q: 'What is an AI answer?',
    a: 'One reply draft or one chat answer written by Bridle AI. With your own AI key, Bridle AI isn’t used and nothing is counted.',
  },
  {
    q: 'What if my AI answers run out?',
    a: `Buy a pack inside Bridle, from ${money(AI.topUpFrom)} for ${count(AI.packs[0].answers)}. Packs never run out. Or connect your own AI key.`,
  },
  {
    q: 'Can I move Pro to another site?',
    a: 'Yes. Click “Remove from this site” in Settings, then add your key on the new site.',
  },
  {
    q: 'What if Pro stops working one day?',
    a: 'It won’t stop. A licence that can’t be checked only stops updates, never a feature. Bridle Pro is GPL.',
  },
  {
    q: 'Can I get my money back?',
    a: `Yes. A full refund within ${PRO.refundDays} days of buying. Unused AI packs too.`,
  },
  {
    q: 'Who handles the payment?',
    a: 'Polar. They take the card; we only see the order.',
  },
];
