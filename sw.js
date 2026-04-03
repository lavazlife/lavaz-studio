const CACHE_NAME = 'lavaz-studio-v2';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './jszip.min.js',
  './assets/logo-ln-circle.png',
  './assets/logo-lld-neon.png',
  './assets/logo-ll-metal.png',
  './assets/character-rb.png',
  './assets/texture-carbon.png'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch event (cache-first strategy)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// Activate event (cleanup old caches)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});