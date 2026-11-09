import type { APIRoute } from 'astro';
import { PAGES } from '../data/pages';

// Every page's Markdown copy in one file.
export const GET: APIRoute = () =>
  new Response(Object.values(PAGES).map((p) => p.md.trim()).join('\n\n---\n\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
