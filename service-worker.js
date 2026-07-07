/* ── GHOST TOUR SERVICE WORKER TOMBSTONE ──
   The old forsyth-tour worker precached /app.js (which no longer exists)
   and stale copies of / and tour.json. No page registers this file anymore,
   but phones that installed it long ago still check for updates here.
   This version deletes its caches and unregisters itself. A proper
   tour-scoped offline worker returns in Phase 3 with versioned caches
   and an explicit, user-consented download flow. */
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
