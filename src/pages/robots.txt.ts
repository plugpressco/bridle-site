import type { APIRoute } from 'astro';

// Every crawler, AI crawlers included, may read the site. Only /api/ and the
// no-JavaScript thank-you page are closed.
export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /thanks/\n\nSitemap: ${new URL('/sitemap-index.xml', site).href}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
