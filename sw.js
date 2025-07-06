// sw.js
const CACHE_NAME = 'video-loop-cache-v6';
const ASSETS = [
  'index.html',
  'upload.html',
  'manifest-index.json',
  'manifest-upload.json',
  'video1.mp4'
];

self.addEventListener('install', evt => {
  evt.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    for (const url of ASSETS) {
      try {
        await cache.add(url);
        console.log('[SW] cached:', url);
      } catch (err) {
        console.error('[SW] failed to cache:', url, err);
      }
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', evt => {
  evt.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => k !== CACHE_NAME)
          .map(old => caches.delete(old))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request)
          .then(cached => cached || fetch(evt.request))
  );
});
