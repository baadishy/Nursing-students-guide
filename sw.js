const CACHE_NAME = "nursing-guide-pwa-v1";
const OFFLINE_URLS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "assets/index-BfkjKLJO.js",
  "assets/index-BmRjjBRh.css",
  "assets/logo-CPrhrEYr.png",
  "assets/icon-192.png",
  "assets/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(OFFLINE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const { request } = event;
  const url = new URL(request.url);

  // App shell navigation: always try cache first for navigations.
  if (request.mode === "navigate") {
    event.respondWith(
      caches.match("index.html").then(
        (cached) =>
          cached ||
          fetch(request).catch(() =>
            caches.match("index.html"),
          ),
      ),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match("index.html"));
    }),
  );
});
