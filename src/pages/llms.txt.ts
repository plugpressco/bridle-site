import type { APIRoute } from 'astro';
import { SITE } from '../data/site';
import { PAGES } from '../data/pages';

// llms.txt: a short map of the site for AI apps (https://llmstxt.org).
export const GET: APIRoute = ({ site }) => {
  const md = (p: string) => new URL(p === '/' ? '/index.md' : p.replace(/\/$/, '') + '.md', site).href;
  const body = `# ${SITE.name}

> ${SITE.definition}

Bridle is a free WordPress plugin, coming soon to WordPress.org. Bridle Pro is a paid add-on, sold on bridle.to from launch day.

## Pages

${Object.values(PAGES).map((p) => `- [${p.title}](${md(p.path)}): ${p.description}`).join('\n')}

## More

- [Full text of this site](${new URL('/llms-full.txt', site).href})
- Built by the team behind Saddle: ${SITE.saddle}
- Contact: ${SITE.email}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
