// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// bridle.to: a static site. Every page is plain HTML with a Markdown copy next
// to it for AI apps (src/pages/*.md.ts and llms.txt). The server functions are
// the price and the checkout (spacefast/functions/api/).
export default defineConfig({
  site: 'https://bridle.to',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  vite: { plugins: [tailwindcss()] },
  integrations: [sitemap({ filter: (page) => !page.includes('/thanks/') && !page.includes('/404') && !page.endsWith('/pro/') && !page.endsWith('/knowledge-base/') })],
});
