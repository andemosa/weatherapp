const cacheName = "cache-v1";
const precacheResources = [
  "/",
  "index.html",
  "style.css",
  "images/icon-128.png",
  "images/icon-192.png",
  "images/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(precacheResources);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
