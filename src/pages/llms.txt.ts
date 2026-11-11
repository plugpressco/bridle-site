import type { APIRoute } from 'astro';
import { SITE, PLAN, PRICE_LINE, count } from '../data/site';
import { PAGES } from '../data/pages';

// llms.txt: a short map of the site for AI apps (https://llmstxt.org).
export const GET: APIRoute = ({ site }) => {
  const md = (p: string) => new URL(p === '/' ? '/index.md' : p.replace(/\/$/, '') + '.md', site).href;
  const body = `# ${SITE.name}

> ${SITE.definition}

Bridle is a WordPress plugin, sold on bridle.to: one licence for ${PLAN.sites} sites, ${PLAN.inboxes} inboxes and ${count(PLAN.answers)} AI answers, paid once. ${PRICE_LINE}

## Pages

${Object.values(PAGES).map((p) => `- [${p.title}](${md(p.path)}): ${p.description}`).join('\n')}

## More

- [Full text of this site](${new URL('/llms-full.txt', site).href})
- Built by the team behind Saddle: ${SITE.saddle}
- Docs: ${SITE.docs}
- Support: ${SITE.support}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
