// sw.js
const CACHE = 'video-loop-cache-v1';
const ASSETS = [
  'index.html',
  'upload.html',
  'manifest-index.json',
  'manifest-upload.json',
  'video1.mp4'
];

self.addEventListener('install', evt =>
  evt.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  )
);

self.addEventListener('activate', evt =>
  evt.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  )
);

self.addEventListener('fetch', evt =>
  evt.respondWith(
    caches.match(evt.request).then(cached => cached || fetch(evt.request))
  )
);
