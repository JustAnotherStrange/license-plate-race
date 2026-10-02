# License Plate Race

Two-car road-trip license plate game (50 states + DC + 10 provinces + 3 territories = 64).
Static site, no build step. Hosted on GitHub Pages; shared state lives in Firebase Realtime Database.

- Repo: https://github.com/JustAnotherStrange/license-plate-race (public, branch `main`)
- Site: https://justanotherstrange.github.io/license-plate-race/
- Deploy = `git push` to `main` (Pages redeploys in ~1-2 min). No CI.

## Files
- `index.html` — entire app (HTML, CSS, JS inline). Plates tab + Map tab, who-saw-it sheet, rename, reset.
- `config.js` — team names/colors, hardcoded `people` per car, Firebase web config, `room` name.
- `map.js` — generated SVG paths (`window.MAP`) for the offline US/Canada map. Source: Natural Earth 50m admin-1, Albers projection, simplified, Hawaii as inset. Regenerate only if the map needs changing; don't hand-edit.
- `sw.js` — service worker: network-first (`cache: "no-cache"`) with cache fallback so the page opens offline. **Bump `CACHE` (e.g. plates-v3 -> v4) and the `?v=` on the `config.js`/`map.js` script tags in `index.html` when shipping changes to those files**, or phones keep stale copies (this already caused a bug: stale `config.js` had no `people`, so the sheet showed only Cancel).
- `new_features.md` — user's feature wishlist (all implemented except the photo feature, which was deliberately disabled).

## Data model (Firebase `roadtrip/...`)
- `roadtrip/{a|b}/{CODE}` = `{t, m, by, lat, lon, d?}`: `t` spotted time, `m` last-modified, `by` person, `d:1` = removed (tombstone). Merge rule: newer `m` (fallback `t`) wins per plate.
- `roadtrip/names/{a|b}` = `{n, t}` — renamed car names, latest `t` wins.
- `roadtrip/resetAt` — timestamp stamped by the "clear everything" button.
- Each car edits only its own list (`me` in localStorage `plate.me`). Local copy is in localStorage (`plate.state`, `plate.names`) and is the source of truth offline; it pushes on reconnect.
- `pushAll()` is gated on `resetChecked` so a stale offline phone can't resurrect data after a reset.

## Behavior notes
- Tapping any tile/map region opens a bottom sheet. Tapping a name chip saves the plate immediately; the GPS fix arrives later and updates the entry (never blocks saving).
- DC counts toward the 64 total but not the "US x/50" count. Canada x/13 includes the 3 territories.
- Light mode only (`color-scheme: light`, no dark styles).
- Photo feature is commented out in `index.html` (cars move too fast). Don't delete it unless asked.
- **Temporary:** "Dangerous: clear everything" button (`#nuke`, password `cleareverything`, checked client-side). User plans to remove it after testing; remove the button and handler together.

## Firebase
- Project `license-plates-1b9d1`, Realtime DB in test mode with open rules (`.read`/`.write` true). Test mode expires 30 days after creation, so rules must be updated for anything longer-lived. The web config in `config.js` is not secret.
- No Firebase Hosting; don't enable it.

## Testing
- No test suite. Quick checks: `node -e` syntax-check the inline script, and screenshot with headless Brave (`/Applications/Brave Browser.app/...`, Chrome isn't installed) against a temp copy with seeded state. Headless min window width is ~500px, so screenshots crop at the right edge.
- Never edit `index.html` via scripts in a shell chain whose `cd`/prereq can fail silently; do test edits on a copy in the scratchpad.
