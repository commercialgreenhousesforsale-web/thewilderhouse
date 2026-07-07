/* ── THE WILDER HOUSE — SERVICE WORKER TOMBSTONE ──
   The old caching worker (wilder-v8) served stale HTML one visit behind.
   This version removes every cache it created, unregisters itself, and
   reloads open tabs so returning visitors get live content immediately.
   Keep this file deployed so old installs can self-remove; pages no
   longer register it. */
self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil((async function () {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map(function (k) { return caches.delete(k); }));
    } catch (err) {}
    try { await self.registration.unregister(); } catch (err) {}
    try {
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(function (c) { c.navigate(c.url); });
    } catch (err) {}
  })());
});
