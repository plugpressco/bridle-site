import type { APIRoute } from 'astro';
import { PAGES } from '../data/pages';

// The Markdown copy of the home page, for AI apps and llms.txt.
export const GET: APIRoute = () =>
  new Response(PAGES.home.md, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
