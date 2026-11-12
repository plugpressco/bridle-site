# bridle.to

The website for Bridle, the help desk that lives in your WordPress: a shared inbox, AI answers, chat and docs in one plugin. One licence is sold here, paid once. A static Astro site with two small server functions (the live price and the checkout), hosted on Spacefast (Space `bridle`, team `fahim-team`), served at https://bridle.to.

Design: `../planning/landing/redesign/` (the approved boards, 11 and 12 November 2026). Positioning: `../planning/POSITIONING.md`.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # astro build, then scripts/postbuild.mjs: writes dist/
npm run preview    # serves dist/ (without the server functions, so the price stays at the first step)
```

## Where things live

| Path | What |
|---|---|
| `src/pages/` | `index` (home), `inbox`, `ai-answers`, `chat`, `docs`, `pricing`, `compare/help-scout`, `demo`, `guides`, `privacy`, `terms`, `thanks` (after a checkout, noindex), `404`; `pro` and `knowledge-base` send old links on to `/pricing/` and `/docs/` (noindex, out of the sitemap); plus `llms.txt`, `llms-full.txt`, `robots.txt` and a `.md` copy of every page |
| `src/data/site.ts` | Shared facts: the one-sentence definition, contact, Bridle AI packs, the licence and its price steps. Change a number here and every page, Markdown copy and JSON-LD follows |
| `src/data/deal.json` | The licence (sites, inboxes, AI answers, first price, Polar product id) and the price steps. The pages, the client script and both server functions read it |
| `src/data/pages.ts` | Each page's title, description and Markdown copy. The Markdown must say what the page says |
| `src/data/faq.ts`, `src/data/legal.ts`, `src/data/cost.ts` | Questions; privacy and terms as data; Help Scout's prices and the side-by-side table, with the day they were read |
| `src/data/shots.json` | The app pictures: size and alt text of each (written by the export, see below) |
| `src/components/b/` | The parts the marketing pages are built from: `FeatureHero`, `Facts`, `Prod` (a tool card), `Agent` (AI apps), `Bill`, `Offer`, `Qa`, `Next3`, `Fin` (the closing), `Shot` (an app picture), `Art` (the dot mountains), `dots.ts` (the dot face and glyphs) |
| `src/components/ui/` | Older primitives, still used by the guides, legal pages, thanks and 404: `Container`, `Section`, `HeadingPair`, `Button` |
| `src/components/` | The menu (a bar, a panel under Product and Resources, a phone sheet), footer, the mark, the icon sprite, a guide, a legal page |
| `src/scripts/` | `nav.js` (the menu, and the bar's buy button that shows after the hero's own buttons scroll away), `deal.js` (the live price), `art.js` (the dot mountains on a canvas) |
| `src/styles/site.css` | The base: Tailwind v4 (`@tailwindcss/vite`, pinned), the `@theme` tokens, the menu, footer, tables, questions, and the prose for privacy, terms and guides |
| `src/styles/b.css` | The design's own parts, every class starting `b-`. Exported from the boards; hand-written additions sit below the marker at the end of the file and survive a new export. The last block there, "White page, framed", sets the layout: a white page, two hairlines framing the content column, a line between sections, boxes flush against the frame |
| `spacefast/functions/api/` | `deal.ts` (`GET /api/deal`, the price right now), `checkout.ts` (`/api/checkout`, opens a Polar checkout), `waitlist.ts` (the old waitlist, no longer on any page) |
| `sf.jsonc` | Declares the Functions runtime with `database: true`. Copied into `dist/` by the build |
| `public/` | Fonts (Mona Sans, Geist, Geist Mono, OFL), app pictures in `img/b/` (WebP, desktop and phone), icons, `og.png` |
| `public/touch-icon-180.png` | 180×180, full bleed; iOS rounds the corners. Not `/apple-touch-icon.png`: the host answers that path with its own default |
| `NOTICE.md` | Third-party licences: fonts (OFL), agent logos (MIT), interface icons (ISC) |

## App pictures

Every picture of the Bridle app on this site is an image, never live mock text, so no made-up email text sits on a page for search engines to read (owner, 11 November 2026). The pictures are drawn as HTML in the design boards and rendered from there:

```bash
cd ../planning/landing/redesign
python3 build-home.py 01-home.text.html && python3 build-pages.py 02-pages.text.html
python3 export-site.py          # writes public/img/b/*.webp, src/data/shots.json and the design part of src/styles/b.css
```

The made-up business on every picture is Fernleaf. Alt texts live in `export-site.py`. Icons and `og.png` are drawn in the same look: the white mark on an orange disc (`#ff4500`).

## Search and AI answers

Every build writes `sitemap-index.xml`, `robots.txt` (all crawlers allowed; `/api/` and `/thanks/` closed), `llms.txt`, `llms-full.txt` and a `.md` copy of each page. `scripts/postbuild.mjs` stops the build when an indexable page breaks a rule: one H1, a title of 60 characters or less, a description of 120 to 160, a canonical address ending in a slash, JSON-LD, a Markdown copy, and no dash used as punctuation.

## Writing rules

Sentence case, like the app. Words a 12-year-old knows, one idea per line, no explaining how it works inside (Fahim, 9 November 2026). No dashes as punctuation, no filler words (seamless, leverage, unlock and friends). Each tool is an icon, a short name and one short line (`src/components/b/tools.ts`). Claim only what Bridle does today, or what ships on launch day. Credit "the team behind Saddle", never Divi Torque.

## Publish (owner)

```bash
npm run build
npx -y spacefast@0.4.1 publish dist --prebuilt --space bridle --team fahim-team -m "what changed"
```

`postbuild.mjs` copies `spacefast/functions/` and `sf.jsonc` into `dist/`, and turns each Markdown copy into a small function (Spacefast turns uploaded `.md` files into pages). Pinned to CLI 0.4.1 on purpose: 0.5.0's local validator drops `runtime.database`, which would disconnect the old waitlist table. Re-check before moving to a newer CLI.

After a publish, check the price and the pages answer:

```bash
curl -s https://bridle.to/api/deal        # {"state":"offer","price":99,...} until the deadline
for p in / /inbox/ /ai-answers/ /chat/ /docs/ /pricing/ /compare/help-scout/ /demo/ /pro/ /knowledge-base/ /privacy/ /terms/ /index.md /pricing.md /llms.txt /robots.txt /sitemap-index.xml; do printf '%s ' "$p"; curl -s -o /dev/null -w '%{http_code}\n' "https://bridle.to$p"; done
curl -sI https://bridle.to | grep -i x-spacefast-version
```

If anything is off after a publish, roll back to the previous version in the Spacefast dashboard.

## Price (Polar)

One licence (Fahim, 12 November 2026): 5 sites, 10 inboxes, 1,000 Bridle AI answers, paid once. Black Friday offer: $99 until the end of Cyber Monday (30 November 2026, 11:59 pm New York), then $249. One price, one deadline, no customer counting. A 7-day refund. The licence, its Polar product id, both prices, the deadline and the refund days live in `src/data/deal.json`. The site calls the product Bridle, never Bridle Pro (the second plugin a buyer installs is still named Bridle Pro; only the thanks page says so). AI packs are sold inside the plugin and are not shown on the pricing page.

- `src/scripts/deal.js` runs the countdown and, at the deadline, switches an open page to the later price. Pages built after the deadline show the later price from the start (`OFFER_ON` in `src/data/site.ts`). Rebuild and publish after the deadline so the Markdown copies and the questions follow.
- `GET` or `POST /api/checkout?plan=5` (`checkout.ts`) opens a Polar checkout for the licence at the price right now, by the server's clock (an ad-hoc price on the private product), and sends buyers back to `/thanks/?checkout_id=…`. When it cannot (no token, no product id, a Polar error) it goes back to `/pricing/?checkout=soon|error#plans` and the offer card says why.
- `GET /api/deal` (`deal.ts`) answers `{ state, price, after, endsAt }` by the server's clock.
- `CHECKOUT_OPEN` in `src/data/site.ts` switches the buy buttons between the checkout and `/pricing/`. `scripts/postbuild.mjs` copies the switch and `deal.json` into both functions, so the page and the checkout never disagree. It warns when a plan has no Polar product id.

**Polar setup (owner):** Bridle's own Polar organization (slug `bridle`, `48c10ba8-ba09-435f-ba30-75ce00a4cf82`, also in `deal.json`).

1. Create the product for this licence: private, one-time, with a licence-key benefit of 5 activations (prefix `BRIDLE`, never expires) and the Bridle Pro zip as a downloadable file. Put its id in `deal.json` (`plans[0].productId`). The three older products (1, 3 and 10 sites) are no longer sold here.
2. On the Spacefast Space `bridle`, `POLAR_TOKEN` (scope `checkouts:write`) is the only variable.
3. Build, publish, buy once with a real card, check the email, key and download, then refund it in Polar.

## Before publishing this design

1. The Polar product above, and its id in `deal.json`. Until then the build prints a warning and the buy button answers "Checkout opens soon".
2. The licence has to mean the same thing in the other repos: 5 site activations, 10 inboxes on the mail service, 1,000 AI answers on first activation (`bridle-ai`, the mail worker, `plugpress-updates`). They still know the three older plans.
3. `public/download/bridle.zip` is what the thanks page links to until WordPress.org lists Bridle (`WPORG_LIVE = false`); copy it from `npm run zip` in `../bridle` after each release.
4. Give `hello@bridle.to` its own Email Routing rule (today it falls through the relay's catch-all to the fallback mailbox).

## Old waitlist

The waitlist form is gone from the pages (Bridle is on sale). Its function and table stay: rows live in the `waitlist` table (email, source, referrer, user agent, created_at). Open them from the Space's database console in the Spacefast dashboard.

## DNS

bridle.to is on Cloudflare (Dotyard account). The apex A records and the verification TXT records for Spacefast are DNS-only (grey cloud); proxying them breaks verification and TLS. MX, SPF, DKIM and DMARC belong to Email Routing; leave them alone.

`www.bridle.to` is the exception. Spacefast never issued a certificate for the www twin, so its two A records are proxied (orange cloud), and the Cloudflare Redirect Rule "www to bridle.to" sends `https://www.bridle.to/*` to `https://bridle.to/${1}` with a 301, keeping the query string. Plain `http://www` already redirects at the origin. If Spacefast ever serves www itself, set those records back to DNS-only and delete the rule.

## Live demo (/demo/)

`/demo/` opens WordPress Playground with `public/demo/blueprint.json`, which Playground fetches from
`raw.githubusercontent.com/plugpressco/bridle-site/main/public/demo/` (GitHub sends the CORS header
Playground needs). It installs Bridle and Bridle KB from the zips beside it, adds two
mu-plugins (`demo-ai.php`, a stand-in AI provider that answers with the best matching doc passage,
not a real model; `demo-relay.php`, so nothing registers on the real email relay) and runs
`seed.php` (a made-up shop, docs, an inbox, six emails, drafts, Chat on). Bridle Pro is never in it.

With each Bridle or Bridle KB release: `npm run zip` in each plugin, copy the zips to
`public/demo/bridle.zip` and `public/demo/bridle-kb.zip`, and push to main. Edit
`blueprint.template.json`, then regenerate `blueprint.json`:
`sed "s#{{BASE}}#https://raw.githubusercontent.com/plugpressco/bridle-site/main/public/demo/#g" public/demo/blueprint.template.json > public/demo/blueprint.json`.
To test locally: serve `public/demo/` on a port, write a copy with that base, and run
`npx @wp-playground/cli@latest server --blueprint=<copy>`.
