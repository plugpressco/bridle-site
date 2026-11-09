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

Sentence case, like the app. Short, plain sentences. No dashes as punctuation, no filler. Claim only what Bridle does today, or what ships on launch day with the plan's prices. Credit "the team behind Saddle", never Divi Torque.

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

## At launch

- Swap the waitlist calls to action for "Get Bridle free" (WordPress.org) and open the Pro checkout (Polar, like mailpuff.io's `/api/checkout` and `/api/deal`).
- Change the "When can I install it?" answer and the "Launching soon" pill.
- Give `hello@bridle.to` its own Email Routing rule (today it falls through the relay's catch-all to the fallback mailbox).
- Point the plugin readme's Terms and Privacy links at https://bridle.to/terms/ and https://bridle.to/privacy/.

## Signups

Rows live in the `waitlist` table: email (unique), source (`hero` / `footer` / `chat` / `pro`), referrer, user agent, created_at. Open them from the Space's database console in the Spacefast dashboard. Duplicate emails and honeypot hits get the same success reply, so the endpoint never reveals who signed up. `smoke-test@example.com` is a test row.

## DNS

bridle.to is on Cloudflare (Dotyard account). The apex A records and the verification TXT records for Spacefast are DNS-only (grey cloud); proxying them breaks verification and TLS. MX, SPF, DKIM and DMARC belong to Email Routing; leave them alone.

`www.bridle.to` is the exception. Spacefast never issued a certificate for the www twin, so its two A records are proxied (orange cloud), and the Cloudflare Redirect Rule "www to bridle.to" sends `https://www.bridle.to/*` to `https://bridle.to/${1}` with a 301, keeping the query string. Plain `http://www` already redirects at the origin. If Spacefast ever serves www itself, set those records back to DNS-only and delete the rule.
