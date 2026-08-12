# talk-scheduler

A single-page dashboard for tracking who's given a Sunday sacrament meeting
talk and who's due for one. Open `index.html` directly, or host it on
GitHub Pages.

## What it does

- Lists all members sorted by most-recent talk first, with members who've
  never spoken at the bottom.
- Tags each member **red** if they spoke within the last 12 months, or
  **green** if they're due (12+ months, or never).
- Search by name, filter to "spoke recently" / "due" / "never spoken", and
  paginate.
- **Record a talk** lets any of the three of you log a talk on the spot
  (stored in that browser's local storage).
- **Sync settings** lets you connect one or more Google Sheet tabs
  (published to the web as CSV) so the page can pull speaker history
  straight from the sheet you already use. In Google Sheets:
  `File → Share → Publish to web`, pick the tab, choose CSV, and paste the
  link in. Columns are 1-indexed (A=1, H=8, I=9, J=10, K=11...).

The page ships with speaker history already seeded from the data provided
when this was built, so it's useful immediately — connecting a live sheet
is optional, for keeping it current going forward.

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
