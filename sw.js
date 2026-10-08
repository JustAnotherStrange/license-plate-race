// Cache the app shell + Firebase SDK so the page opens with no cell service.
const CACHE = "plates-v8";
const SHELL = ["./", "index.html", "config.js", "map.js", "manifest.json",
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {})))));
  self.skipWaiting();
});
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())));

// Network first (so config/code updates arrive), fall back to cache offline.
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.hostname.endsWith("firebaseio.com")) return;
  e.respondWith(fetch(e.request, { cache: "no-cache" }).then(r => {
    const copy = r.clone();
    caches.open(CACHE).then(c => c.put(e.request, copy));
    return r;
  }).catch(() => caches.match(e.request)));
});
