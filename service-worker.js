/**
 * SERVICE WORKER — Offline Caching for Forsyth Ghost Tour
 * Caches: app shell, tour.json, audio files
 */

const CACHE_NAME = 'forsyth-tour-v2.2';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/data/tour.json',
  '/manifest.json'
];

// ===== INSTALL =====

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app shell');
      return cache.addAll(urlsToCache);
    })
  );

  self.skipWaiting();
});

// ===== ACTIVATE =====

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// ===== FETCH STRATEGY: Network First with Cache Fallback =====

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // HTML: Network first, cache fallback
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const cache = caches.open(CACHE_NAME);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // JSON: Network first, cache fallback
  if (url.pathname.endsWith('.json')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const cache = caches.open(CACHE_NAME);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((response) => {
            return response || new Response('{}', { status: 404 });
          });
        })
    );
    return;
  }

  // Audio files: Cache first, network fallback
  if (url.pathname.startsWith('/audio/') && url.pathname.endsWith('.mp3')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then((response) => {
            if (response.ok) {
              const cache = caches.open(CACHE_NAME);
              cache.then((c) => c.put(request, response.clone()));
            }
            return response;
          })
          .catch(() => {
            console.warn('[SW] Audio file not available:', url.pathname);
            return new Response(null, { status: 404 });
          });
      })
    );
    return;
  }

  // JavaScript, CSS: Cache first, network fallback
  if (
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(request).then((response) => {
            const cache = caches.open(CACHE_NAME);
            cache.then((c) => c.put(request, response.clone()));
            return response;
          })
        );
      })
    );
    return;
  }

  // Default: Network first, cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// ===== MESSAGE HANDLING =====

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
