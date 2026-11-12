// What Help Scout costs and does, next to Bridle: the bill on the home and
// Help Scout pages (2 people, 300 AI answers) and the side-by-side table.
// Read on helpscout.com/pricing on the day in CHECKED, billed yearly, at the
// named plan. Help Scout bills per AI resolution; Bridle counts answers.
// Change a price here and the pages and their Markdown copies follow.
import { AI, PLAN, PRICE, money, count } from './site';

export type Rival = { key: string; name: string; plan: string; seat: number; perAnswer: number; source: string };

export const PEOPLE = 2;
export const CHECKED = '11 November 2026';

export const RIVALS: Rival[] = [
  { key: 'hs', name: 'Help Scout', plan: 'Standard', seat: 25, perAnswer: 0.75, source: 'https://www.helpscout.com/pricing/' },
];

// A Bridle AI answer after the ones in the licence: the smallest pack's price.
export const BRIDLE_PER_ANSWER = AI.packs[0].price / AI.packs[0].answers;

// The side-by-side table: [row, Help Scout, Bridle]. true = yes, false = no.
export const HS_ROWS: [string, string | boolean, string | boolean][] = [
  ['Where it runs', 'Their cloud app', 'Your WordPress admin'],
  ['Where your emails are kept', 'Help Scout’s servers', 'Your own site'],
  ['Shared inbox', true, true],
  ['Help center', true, true],
  ['Chat on your site', true, true],
  ['AI that answers customers', '$0.75 per answer', `${count(PLAN.answers)} included, then about $${BRIDLE_PER_ANSWER.toFixed(2)}`],
  ['AI reply drafts', 'Unlimited on Plus, $45 a person', true],
  ['Your own AI key', false, true],
  ['Teammates', 'Paid per person', 'No limit, no fee'],
  ['Phone app', true, false],
  ['WhatsApp, Instagram, Messenger', true, false],
  ['HIPAA', 'On Pro, $75 a person', false],
  ['Price', 'From $25 a person, every month', `${money(PRICE)}, once`],
];
