const CACHE_NAME = 'fb4k-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/theme.css',
  '/theme.js',
  '/app.js',
  '/manifest.json',
  '/favicon.svg',
  '/favicon-48x48.png',
  '/favicon-96x96.png',
  '/facebook-reels-downloader',
  '/fb-to-mp3',
  '/facebook-story-downloader',
  '/facebook-watch-downloader',
  '/bulk-fb-reel-downloader',
  '/how-to-use',
  '/faq',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/blog'
];

// Install Event - Pre-cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[FB4K ServiceWorker] Pre-caching static assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[FB4K ServiceWorker] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Stale-While-Revalidate for ultrafast loading
self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith('http')) return;
  // Skip API transcode / download streaming requests so video downloads aren't cached in SW
  if (event.request.url.includes('/api/') || event.request.url.includes('/download') || event.request.url.includes('/stream')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Return cached if network fails
        return cachedResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
