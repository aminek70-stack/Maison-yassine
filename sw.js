// Service Worker - Maison Yassine
// Vider tout le cache à chaque mise à jour

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

// Toujours aller chercher depuis le réseau (pas de cache)
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});
