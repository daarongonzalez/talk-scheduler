# talk-scheduler

A dashboard for tracking who's given a Sunday sacrament meeting talk and
who's due for one: a static `index.html` frontend plus a small Cloudflare
Worker (`worker/index.js`) backed by D1, so records are shared identically
across all three ward leaders instead of living in one browser's storage.

## What it does

- Lists all members sorted by most-recent talk first, with members who've
  never spoken at the bottom.
- Tags each member **red** if they spoke within the last 12 months, or
  **green** if they're due (12+ months, or never).
- Search by name, filter to "spoke recently" / "due" / "never spoken", and
  paginate.
- **Record a talk** / **Manage records** let any of the three of you add,
  edit, or delete a talk record. These are stored in a shared Cloudflare
  D1 database via the `/api/talks` endpoint (see `worker/index.js`), so
  what one leader enters shows up identically for the other two — nothing
  is kept in browser local storage.
- Historical/seeded talk data (`SEED_TALKS` in `index.html`) is baked in
  from the ward's published meeting-schedule sheet. It's a snapshot, not
  a live sync: when the sheet changes, send an updated CSV export and
  ask for the seed data to be refreshed and redeployed. (A live
  publish-to-web CSV link was attempted but isn't working yet — once
  there's a working one, auto-fetching it on page load is a small,
  self-contained change.)

Because manual records live behind `/api/talks`, opening `index.html`
directly (`file://`) will show the seeded history but "Record a talk" /
"Manage records" won't work — run it via `wrangler dev` or the deployed
Worker for full functionality.

## Hosting on Cloudflare Workers

The site is served as a static Worker (see `wrangler.jsonc`) on
`af41st.com`, deployed automatically on push to `main` via Workers
Builds, and gated by Cloudflare Access (one-time PIN login).

One-time setup in the Cloudflare dashboard (not scriptable from here):

1. **Connect the repo** — Workers & Pages → Create → Workers →
   Import a repository → pick `talk-scheduler` → branch `main`.
   Wrangler picks up `wrangler.jsonc` automatically, including the
   `af41st.com` custom domain route.
2. **Create the Access application** — Zero Trust → Access →
   Applications → Add an application → Self-hosted. Set the domain to
   `af41st.com` (root domain, no path). Under authentication, enable
   **One-time PIN** as the login method.
3. **Create the Access policy** — Allow action, include rule: Emails,
   listing the three ward leaders who should have access.

The D1 database (`talk-scheduler-db`, bound as `DB`) already exists and
is wired up in `wrangler.jsonc`; Workers Builds provisions it on deploy,
no extra dashboard step needed.

## Local development

```
npx wrangler d1 execute talk-scheduler-db --local --command "CREATE TABLE IF NOT EXISTS talks (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, date TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now')));"
npx wrangler dev
```
