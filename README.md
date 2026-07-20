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

## Hosting on GitHub Pages

Settings → Pages → Deploy from branch → pick this branch and `/ (root)`.
The site will be served at `https://<user>.github.io/talk-scheduler/`.
