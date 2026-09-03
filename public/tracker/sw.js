const CACHE = "verdansc-outreach-v11-tracker";
const ASSETS = [
  "/tracker/",
  "/tracker/index.html",
  "/tracker/styles.css",
  "/tracker/app.js",
  "/tracker/slots.js",
  "/tracker/manifest.webmanifest",
  "/tracker/icons/icon-192.png",
  "/tracker/icons/icon-512.png",
  "/tracker/icons/icon-512-maskable.png",
  "/tracker/icons/apple-touch-icon.png",
  "/tracker/icons/icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        return response;
      }).catch(() => caches.match("/tracker/index.html"));
    })
  );
});
