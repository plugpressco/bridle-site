# bridle.to

The website for Bridle (free, launching on WordPress.org) and Bridle Pro (sold here from launch day). A static Astro site with one server function (the waitlist), hosted on Spacefast (Space `bridle`, team `fahim-team`), served at https://bridle.to.

Plan: `../planning/BRIDLE-NEXT.md` §5 (site) and `../planning/BRIDLE-PRO.md` §10–12 (prices). Brand: `../rebrand/BRAND.md`, the same tokens as the plugin app.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # astro build, then scripts/postbuild.mjs: writes dist/
npm run preview    # serves dist/ (without the waitlist function)
```

## Where things live

| Path | What |
|---|---|
| `src/pages/` | `index` (home), `chat`, `pro`, `privacy`, `terms`, `thanks` (the no-JavaScript waitlist landing, noindex), `404`; plus `llms.txt`, `llms-full.txt`, `robots.txt` and a `.md` copy of every page |
| `src/data/site.ts` | Shared facts: the one-sentence definition, contact, Turnstile site key, Bridle AI packs, Pro plans and prices. Change a number here and every page, Markdown copy and JSON-LD follows |
| `src/data/pages.ts` | Each page's title, description and Markdown copy. The Markdown must say what the page says |
| `src/data/faq.ts`, `src/data/legal.ts` | Questions; privacy and terms as data (the pages and their Markdown copies render from it) |
| `src/components/` | The menu, footer, waitlist form, closing card, chat demo; home sections in `home/` |
| `src/scripts/kit.js` | The halftone dot engine every picture is drawn with, the dot-matrix faces and `settle()` (dots that settle into a shape) |
| `src/scripts/home.js` | The home page's moving pictures from the approved v11 page: the dot-field hero, the product window, three dot stories, the AI apps chat |
| `src/scripts/chat-demo.js` | Bridle Chat, played, in the plugin's own words |
| `src/styles/` | `global.css` (tokens and shared pieces), `home.css`, `demo.css` |
| `spacefast/functions/api/waitlist.ts` | `POST /api/waitlist`: stores sign-ups in the Space's MySQL (table `waitlist`) |
| `sf.jsonc` | Declares the Functions runtime with `database: true` (that's what gives the function `env.DB`). Copied into `dist/` by the build |
| `public/` | Fonts (Mona Sans, Geist Mono, OFL), icons, `og.png`, `fahim.jpg` |
| `public/touch-icon-180.png` | 180×180, full bleed; iOS rounds the corners. Not `/apple-touch-icon.png`: the host answers that path with its own default |
| `NOTICE.md` | Third-party licences: fonts (OFL), agent logos (MIT), interface icons (ISC) |

## Search and AI answers

Every build writes `sitemap-index.xml`, `robots.txt` (all crawlers allowed; `/api/` and `/thanks/` closed), `llms.txt`, `llms-full.txt` and a `.md` copy of each page. `scripts/postbuild.mjs` stops the build when an indexable page breaks a rule: one H1, a title of 60 characters or less, a description of 120 to 160, a canonical address ending in a slash, JSON-LD, a Markdown copy, and no dash used as punctuation.

## Writing rules

Sentence case, like the app. Words a 12-year-old knows, one idea per line, no explaining how it works inside (Fahim, 9 November 2026). No dashes as punctuation, no filler words (seamless, leverage, unlock and friends). Each feature is an icon, a 2 to 4 word name and one short line (`FREE_FEATURES`, `PRO_FEATURES` in `src/data/site.ts`). Claim only what Bridle does today, or what ships on launch day. Credit "the team behind Saddle", never Divi Torque.

## Publish (owner)

```bash
npm run build
npx -y spacefast@0.4.1 publish dist --prebuilt --space bridle --team fahim-team -m "what changed"
```

`postbuild.mjs` copies `spacefast/functions/` and `sf.jsonc` into `dist/`, and turns each Markdown copy into a small function (Spacefast turns uploaded `.md` files into pages). Pinned to CLI 0.4.1 on purpose: 0.5.0's local validator drops `runtime.database`, which would disconnect the waitlist from its database. Re-check before moving to a newer CLI.

After a publish, check the form still saves and the pages answer:

```bash
curl -s -X POST https://bridle.to/api/waitlist -H 'content-type: application/json' -d '{"email":"smoke-test@example.com","source":"smoke-test"}'
# {"ok":true}  (a 500 means env.DB is missing)
for p in / /chat/ /pro/ /privacy/ /terms/ /index.md /pro.md /llms.txt /robots.txt /sitemap-index.xml; do printf '%s ' "$p"; curl -s -o /dev/null -w '%{http_code}\n' "https://bridle.to$p"; done
curl -sI https://bridle.to | grep -i x-spacefast-version
```

The first publish of this Astro build replaces the single-page v11 site (one `index.html`). If anything is off, roll back to the previous version in the Spacefast dashboard.

## Turnstile

Off until both halves are set: the widget's site key in `TURNSTILE_SITEKEY` (`src/data/site.ts`) and `TURNSTILE_SECRET` plus `TURNSTILE_HOSTNAMES` (`bridle.to,www.bridle.to`) on the Space. Without the secret the function skips the check; the honeypot, the too-fast check and the per-visitor rate limit always run. A secret on the Space with no site key in the page refuses every sign-up, so set them together.

## Bridle Pro price (Polar)

Three licences, every Pro feature in each, pay once (Fahim, 9 November 2026). Plans, Polar product ids and steps live in `src/data/deal.json`:

| Licence | First price | Bridle AI answers | Polar product |
| --- | --- | --- | --- |
| 1 site | $49 | 1,000 | `0cd62812-7220-414d-b915-5bb2973530e8` |
| 3 sites | $79 | 3,000 | `ecfdec26-784a-4d25-bc3a-abd39aeeb443` |
| 10 sites | $149 | 10,000 | `2f6e2605-4cbc-4e3d-b582-5739eb8c7e0d` |

All three go up $20 every 20 sales, counting every Bridle Pro sale together: sales 1 to 10 pay the first prices, 11 to 30 pay $69 / $99 / $169, and so on. Pay once ends after sale 170; then Pro is yearly. When the answers run out, buyers top up inside the plugin (from $10); the site only says so.

- `GET /api/deal` (`spacefast/functions/api/deal.ts`) counts paid orders across the three products on Polar (cached 60 seconds) and answers `{ state, sold, total, step, from, to, left, rise, plans: [{ key, sites, answers, price, next }], live }`. The cards (`src/components/Price.astro`, `src/scripts/deal.js`) show it once Polar answers; until then they show the first prices from the build, never a made-up count.
- `GET` or `POST /api/checkout?plan=1|3|10` (`checkout.ts`) opens a Polar checkout for that plan's product at the current step's price (an ad-hoc price on the private product), and sends buyers back to `/thanks/?checkout_id=…`.
- `CHECKOUT_OPEN` in `src/data/site.ts` is the one launch switch. While it is `false` every price button says "Join the waitlist" and `/api/checkout` sends people back to `/pro/#price`. `scripts/postbuild.mjs` copies the switch and `deal.json` into both functions, so the page and the checkout always agree.

**Polar setup (owner):** the three products already exist in Bridle's own Polar organization (slug `bridle`, `48c10ba8-ba09-435f-ba30-75ce00a4cf82`, also in `deal.json`; its own org so Bridle can be sold apart from Mailpuff). Keep them private, with their licence-key benefits.

1. Create an **organization access token** with the scopes `orders:read` and `checkouts:write`.
2. On the Spacefast Space `bridle`, set `POLAR_TOKEN` as a secret. That's the only variable (`POLAR_ORG_ID` is optional; the id is in `deal.json`). Check it: `curl -s https://bridle.to/api/deal` says `"live":true`.
3. On launch day set `CHECKOUT_OPEN = true`, build and publish.

## At launch

- Set `CHECKOUT_OPEN = true` (above). Swap the other waitlist calls to action for "Get Bridle free" (WordPress.org).
- Change the "When can I get it?" answer and the "Launching soon" pill.
- Give `hello@bridle.to` its own Email Routing rule (today it falls through the relay's catch-all to the fallback mailbox).

## Signups

Rows live in the `waitlist` table: email (unique), source (`hero` / `footer` / `chat` / `pro`), referrer, user agent, created_at. Open them from the Space's database console in the Spacefast dashboard. Duplicate emails and honeypot hits get the same success reply, so the endpoint never reveals who signed up. `smoke-test@example.com` is a test row.

## DNS

bridle.to is on Cloudflare (Dotyard account). The apex A records and the verification TXT records for Spacefast are DNS-only (grey cloud); proxying them breaks verification and TLS. MX, SPF, DKIM and DMARC belong to Email Routing; leave them alone.

`www.bridle.to` is the exception. Spacefast never issued a certificate for the www twin, so its two A records are proxied (orange cloud), and the Cloudflare Redirect Rule "www to bridle.to" sends `https://www.bridle.to/*` to `https://bridle.to/${1}` with a 301, keeping the query string. Plain `http://www` already redirects at the origin. If Spacefast ever serves www itself, set those records back to DNS-only and delete the rule.

## Live demo (/demo/)

`/demo/` opens WordPress Playground with `public/demo/blueprint.json`, which Playground fetches from
`raw.githubusercontent.com/plugpressco/bridle-site/main/public/demo/` (GitHub sends the CORS header
Playground needs). It installs the free Bridle and Bridle KB from the zips beside it, adds two
mu-plugins (`demo-ai.php`, a stand-in AI provider that answers with the best matching doc passage,
not a real model; `demo-relay.php`, so nothing registers on the real email relay) and runs
`seed.php` (a made-up shop, docs, an inbox, six emails, drafts, Chat on). Bridle Pro is never in it.

With each Bridle or Bridle KB release: `npm run zip` in each plugin, copy the zips to
`public/demo/bridle.zip` and `public/demo/bridle-kb.zip`, and push to main. Edit
`blueprint.template.json`, then regenerate `blueprint.json`:
`sed "s#{{BASE}}#https://raw.githubusercontent.com/plugpressco/bridle-site/main/public/demo/#g" public/demo/blueprint.template.json > public/demo/blueprint.json`.
To test locally: serve `public/demo/` on a port, write a copy with that base, and run
`npx @wp-playground/cli@latest server --blueprint=<copy>`.
