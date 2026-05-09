/* HSK4 service worker — static cache for GitHub Pages. */
const CACHE_NAME = 'hsk4-release-v5';
const CORE_ASSETS = [
  './',
  './index.html',
  './mock6.html',
  './mock9.html',
  './assets/hsk4-ui.css',
  './assets/hsk4-ui.js',
  './assets/hsk4-mock6-redesign.css',
  './assets/hsk4-mock6-redesign.js',
  './assets/hsk4-mock9-redesign.css',
  './assets/hsk4-mock9-redesign.js',
  './assets/hsk4-final-polish.css',
  './assets/hsk4-final-polish.js',
  './assets/hsk4-release-hardening.css',
  './assets/hsk4-release-hardening.js',
  './assets/icons/icon.svg',
  './site.webmanifest',
  './data/hsk4_mock9_extracted.json',
  './data/hsk4_mock9_extracted_full.json',
  './data/hsk4_mock9_audio_urls.json',
  './og-image.png',
  './og-mock6.png',
  './og-mock9.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  const isHtml = request.headers.get('accept')?.includes('text/html');
  if (isHtml) {
    event.respondWith(fetch(request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      return response;
    }).catch(() => caches.match(request).then(cached => cached || caches.match('./index.html'))));
    return;
  }

  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    const copy = response.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
    return response;
  })));
});
