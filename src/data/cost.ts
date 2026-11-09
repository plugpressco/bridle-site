// The cost comparison on the home and pricing pages: what 2 people pay in a
// month for a number of AI answers. Read from each company's own pricing page
// on 10 November 2026 (planning/landing/research/03-competitors.md), billed
// yearly, at the named plan. They bill per AI resolution; Bridle per answer.
// Change a price here and both pages, the slider and the note follow.
import { AI } from './site';

export type Rival = { key: string; name: string; plan: string; seat: number; perAnswer: number; included: number; source: string };

export const PEOPLE = 2;
export const CHECKED = '10 November 2026';

export const RIVALS: Rival[] = [
  { key: 'hs', name: 'Help Scout', plan: 'Standard', seat: 25, perAnswer: 0.75, included: 0, source: 'https://www.helpscout.com/pricing/' },
  { key: 'ic', name: 'Intercom', plan: 'Essential', seat: 29, perAnswer: 0.99, included: 0, source: 'https://www.intercom.com/pricing' },
  { key: 'zd', name: 'Zendesk', plan: 'Suite Team', seat: 55, perAnswer: 2.0, included: 10, source: 'https://www.zendesk.com/pricing/' },
];

// Bridle AI: the first AI.free answers each month are free, then $10 per 1,000.
export const BRIDLE_PER_ANSWER = AI.packs[0].price / AI.packs[0].answers;

export const monthly = (n: number) => ({
  bridle: Math.max(0, n - AI.free) * BRIDLE_PER_ANSWER,
  ...Object.fromEntries(RIVALS.map((r) => [r.key, PEOPLE * r.seat + Math.max(0, n - r.included) * r.perAnswer])),
}) as Record<string, number>;

export const money = (v: number) => '$' + (v < 10 && v % 1 ? v.toFixed(2) : Math.round(v).toLocaleString('en-US'));
