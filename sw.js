/* HSK4 service worker — Network-First for HTML/CSS/JS to avoid stale content. */
const CACHE_NAME = 'hsk4-release-v50';
const CORE_ASSETS = [
  './assets/icons/icon.svg',
  './site.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  // Network-First for HTML, CSS, JS - always get fresh
  const isFreshable = /\.(html|css|js)$/.test(url.pathname) ||
                      url.pathname === '/' ||
                      url.pathname.endsWith('/') ||
                      request.headers.get('accept')?.includes('text/html');

  if (isFreshable) {
    event.respondWith(
      fetch(request, {cache: 'no-store'})
        .then(response => {
          // Update cache in background
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-First for images and other static assets
  event.respondWith(
    caches.match(request).then(cached => 
      cached || fetch(request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      })
    )
  );
});
