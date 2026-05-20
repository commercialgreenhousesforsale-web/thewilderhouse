/* ── THE WILDER HOUSE — SERVICE WORKER v2 ── */
/* Stale-while-revalidate for HTML; long-cache for images/fonts */

const CACHE = 'wilder-v6';

const SHELL = [
  '/',
  '/savannah-ghost-tour.html',
  '/forsyth-park-vacation-rental-savannah-314a',
  '/savannah-victorian-district-vacation-rental-316a',
  '/savannah-group-vacation-rental-4-bedroom',
  '/savannah-bachelorette-party-rental',
  '/savannah-vacation-rental-with-parking',
  '/savannah-romantic-vacation-rental',
  '/savannah-day-planner',
  '/reviews',
  '/contact',
  '/historic-savannah-vacation-rentals',
  '/historic-savannah-vacation-rental',
  '/savannah-victorian-district',
  '/wilder-house-savannah-vacation-rental',
  '/wilder-house',
  '/family-vacation-rental',
  '/savannah-st-patricks-day-vacation-rental',
  '/savannah-farmers-market',
  '/house-rules',
  '/manifest.json',
  '/wilder-house-forsyth-park-savannah-vacation-rental.webp',
  '/314a-forsyth-park-vacation-rental-savannah-hero.webp',
  '/316a-victorian-district-airbnb-savannah-exterior-east-park-avenue.webp',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  /* Never intercept non-GET requests — form POSTs must go straight to network */
  if (e.request.method !== 'GET') return;

  /* Always network for live APIs and third-party embeds */
  const liveHosts = [
    'api.open-meteo.com',
    'api.sunrise-sunset.org',
    'api.tidesandcurrents.noaa.gov',
    'embed.windy.com',
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'www.google.com',
    'maps.googleapis.com',
    'www.airbnb.com',
    'api.web3forms.com',
    'api.elevenlabs.io',
    'cdnjs.cloudflare.com',
    'basemaps.cartocdn.com',
    'api.mapbox.com',
    'tile.openstreetmap.org',
  ];
  if (liveHosts.some((h) => url.hostname.includes(h))) return;

  /* Images — cache-first (they have 1-year Cache-Control from _headers) */
  if (/\.(webp|png|jpg|jpeg|ico)$/i.test(url.pathname)) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        if (cached) return cached;
        return fetch(e.request).then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  /* HTML / everything else — stale-while-revalidate */
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetched = fetch(e.request)
        .then((res) => {
          if (res && res.status === 200 && e.request.method === 'GET') {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetched;
    })
  );
});
