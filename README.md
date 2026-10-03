# bridle.to

The Bridle waitlist page, hosted on Spacefast (Space `bridle`, team `fahim-team`), served at https://bridle.to.

## What's here

| Path | What |
|---|---|
| `index.html` | The whole page: markup, styles and script in one file |
| (inline in `index.html`) | ChatGPT, Claude, Codex, Cursor and MCP logos in the agents section, from LobeHub Icons (`@lobehub/icons-static-svg`, MIT) |
| `thanks.html` | Where the no-JavaScript form post lands |
| `functions/api/waitlist.ts` | `POST /api/waitlist`: stores signups in the Space's MySQL (table `waitlist`) |
| `sf.jsonc` | Declares the Functions runtime with `database: true` (that's what gives the worker `env.DB`) |
| `fonts/figtree-latin.woff2`, `fonts/geist-mono-latin.woff2` | Figtree (UI and headlines) and Geist Mono (addresses), self-hosted, SIL Open Font License. Same fonts and tokens as the plugin app; see `../rebrand/BRAND.md` |
| `fahim.jpg` | Founder photo beside the "Built by the team behind Saddle" line (192×192, self-hosted) |
| `favicon.svg` | The mark; turns lighter blue in dark mode |
| `icon-128.png`, `icon-256.png` | The app tile (blue mark on ink), linked from the plugin's `manifest.json` |
| `apple-touch-icon.png` | 180×180, full bleed; iOS rounds the corners |
| `og.png` | Social preview, 1200×630 |

## Publish

```bash
npx -y spacefast@0.4.1 publish . --space bridle --team fahim-team -m "what changed"
```

Pinned to CLI 0.4.1 on purpose: 0.5.0's local validator warns that `runtime.database` is unknown and drops it, which would disconnect the waitlist from its database. The live schema at https://spacefast.com/schemas/sf.json still lists the key. Re-check before moving to a newer CLI.

After a publish, check the form still saves:

```bash
curl -s -X POST https://bridle.to/api/waitlist -H 'content-type: application/json' -d '{"email":"smoke-test@example.com","source":"smoke-test"}'
# {"ok":true}  (a 500 means env.DB is missing)
```

## Signups

Rows live in the `waitlist` table: email (unique), source (`hero` / `footer`), referrer, user agent, created_at. Open them from the Space's database console in the Spacefast dashboard. Duplicate emails and honeypot hits get the same success reply, so the endpoint never reveals who signed up. `smoke-test@example.com` is a test row.

## DNS

bridle.to is on Cloudflare (Dotyard account). The A and verification TXT records for Spacefast are DNS-only (grey cloud); proxying them breaks verification and TLS. MX, SPF, DKIM and DMARC belong to Email Routing; leave them alone.
