// What the one licence holds, tool by tool: three short lines each. The
// pricing page shows it as four cells; its Markdown copy lists the same lines.
// Only what Bridle does today.
import type { ToolKey } from '../components/b/tools';

export const IN_THE_LICENCE: { tool: ToolKey; items: string[] }[] = [
  { tool: 'inbox', items: ['Sorts every email for you', 'Team notes and saved replies', 'A nudge when a reply is late'] },
  { tool: 'ai', items: ['Replies written from your docs', 'Every fact checked', 'Your own AI key works too'] },
  { tool: 'chat', items: ['Chat on all your sites', 'Live chat, with your hours', 'Hands over to you when stuck'] },
  { tool: 'docs', items: ['A help center on your site', 'A list of missing answers', 'Import from Help Scout or Notion'] },
];
// Also in the licence, in one line under the four cells.
export const ALSO = 'Order lookups (WooCommerce, EDD, Polar, Freemius) and any MCP app, like Claude or ChatGPT.';
