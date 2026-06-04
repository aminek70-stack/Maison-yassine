// Service Worker - Maison Yassine PWA
const CACHE_NAME = 'maison-yassine-v1';

// Installation
self.addEventListener('install', event => {
  console.log('SW: Installation...');
  self.skipWaiting();
});

// Activation
self.addEventListener('activate', event => {
  console.log('SW: Activé');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Stratégie Network First (toujours la dernière version de GitHub)
self.addEventListener('fetch', event => {
  // On ignore les requêtes Supabase et CDN - toujours en ligne
  if (
    event.request.url.includes('supabase') ||
    event.request.url.includes('jsdelivr') ||
    event.request.url.includes('cdn')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Mettre en cache la réponse fraîche
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Si pas de réseau, utiliser le cache
        return caches.match(event.request);
      })
  );
});
