const CACHE = 'vastu-cam-v1';
const CORE = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Network-first for app code (fresh updates), fallback to cache when offline.
   OSM tiles / geocoding / jsPDF: cache-first after first use. */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const isApp = url.origin === location.origin;
  e.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      if (isApp) {
        try {
          const res = await fetch(e.request);
          cache.put(e.request, res.clone());
          return res;
        } catch (err) {
          const hit = await cache.match(e.request);
          if (hit) return hit;
          return cache.match('./index.html');
        }
      } else {
        const hit = await cache.match(e.request);
        if (hit) return hit;
        try {
          const res = await fetch(e.request);
          if (res.ok && (url.hostname.includes('openstreetmap') || url.hostname.includes('cdnjs')))
            cache.put(e.request, res.clone());
          return res;
        } catch (err) {
          return Response.error();
        }
      }
    })()
  );
});
