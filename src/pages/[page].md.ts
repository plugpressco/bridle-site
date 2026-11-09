import type { APIRoute, GetStaticPaths } from 'astro';
import { PAGES } from '../data/pages';

// The Markdown copy of every inner page (/chat.md, /pro.md, /privacy.md, /terms.md).
export const getStaticPaths: GetStaticPaths = () =>
  Object.values(PAGES)
    .filter((p) => p.path !== '/')
    .map((p) => ({ params: { page: p.path.replace(/^\/|\/$/g, '') }, props: { text: p.md } }));

export const GET: APIRoute = ({ props }) =>
  new Response((props as { text: string }).text, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
