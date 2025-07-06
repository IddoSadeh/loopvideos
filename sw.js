const CACHE_NAME = 'video-loop-cache-final-v1';
const ASSETS = [
  'index.html',
  'manifest.json',
  'sw.js',
  'invisible-man.jpg'  
];

// On install: cache shell
self.addEventListener('install', evt => {
  evt.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    for (const url of ASSETS) {
      try {
        await cache.add(url);
        console.log('cached:', url);
      } catch (err) {
        console.error('failed to cache:', url, err);
      }
    }
    self.skipWaiting();
  })());
});

// On activate: clean up old
self.addEventListener('activate', evt => {
  evt.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(key => key !== CACHE_NAME)
          .map(old => caches.delete(old))
    );
    self.clients.claim();
  })());
});

// On fetch: serve cache-first
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cached => cached || fetch(evt.request))
  );
});
