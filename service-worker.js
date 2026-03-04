const CACHE_NAME = 'calcul-pwa-v2';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './unicorn.png'
  // Note: Removed './assets/IMG_3723.png' to allow icon updates
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
