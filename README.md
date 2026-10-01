# License Plate Race

Two cars race to spot all 50 states, DC, 10 provinces and 3 territories (64 total).
Tap a tile to mark a plate found. Tap the 📷 on a found tile to attach a photo.
Each car edits only its own list and sees the other car's progress.

## Offline behavior
- Everything saves on the phone instantly and syncs when service returns.
- Open the site once with service so it caches, then "Add to Home Screen".
- Multiple phones in one car merge by latest edit per plate.

## Setup (~5 min, free)
1. Go to https://console.firebase.google.com, **Add project** (skip Analytics).
2. **Build > Realtime Database > Create database** (any region), start in **test mode**.
3. Open the **Rules** tab and paste this, then Publish (test mode expires after 30 days):
   ```json
   { "rules": { ".read": true, ".write": true } }
   ```
4. **Project settings (gear) > Your apps > Web (`</>`)**, register an app, and copy the `firebaseConfig` values into `config.js`
   (make sure `databaseURL` is included; it's shown on the Realtime Database page).
5. Edit the team names/colors in `config.js`.
6. Push this folder to a GitHub repo, then **Settings > Pages > Deploy from branch (main, root)**.
7. Open the Pages URL on every phone, pick your car, done.

The rules above are open to anyone with the URL, which is fine for a road trip game.
Without Firebase configured the app still works, local-only.
