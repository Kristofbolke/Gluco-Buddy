// Gluco Buddy - Service Worker
// Versie: 1.0.0

const CACHE_NAME = 'gluco-buddy-v3';
const RUNTIME_CACHE = 'gluco-buddy-runtime-v3';

// Bestanden die altijd gecached worden bij installatie
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// =============================================
// INSTALLATIE - cache alle core bestanden
// =============================================
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Pre-caching core bestanden...');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
      .catch(err => console.warn('[SW] Pre-cache fout (niet fataal):', err))
  );
});

// =============================================
// ACTIVATIE - verwijder oude caches
// =============================================
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map(name => {
            console.log('[SW] Oude cache verwijderen:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// =============================================
// FETCH - Stale-While-Revalidate strategie
// =============================================
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Sla Supabase API calls altijd over (die moeten live zijn)
  if (url.hostname.includes('supabase') || 
      url.hostname.includes('googleapis') ||
      url.hostname.includes('jsdelivr') ||
      request.method !== 'GET') {
    return;
  }

  // Voor navigatieverzoeken: probeer netwerk, val terug op cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => {
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // Voor overige bestanden: cache first, dan netwerk
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        // Geef gecachede versie terug, update op achtergrond
        fetch(request).then(networkResponse => {
          if (networkResponse && networkResponse.ok) {
            caches.open(RUNTIME_CACHE).then(cache => {
              cache.put(request, networkResponse.clone());
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }

      // Niet in cache: haal op van netwerk
      return fetch(request).then(response => {
        if (!response || !response.ok) return response;
        const clone = response.clone();
        caches.open(RUNTIME_CACHE).then(cache => cache.put(request, clone));
        return response;
      }).catch(() => {
        // Offline fallback voor afbeeldingen
        if (request.destination === 'image') {
          return new Response(
            `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
              <rect width="100" height="100" fill="#FFF5EF"/>
              <text x="50" y="55" text-anchor="middle" font-size="30">💊</text>
            </svg>`,
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        }
      });
    })
  );
});

// =============================================
// PUSH NOTIFICATIES
// =============================================
self.addEventListener('push', event => {
  if (!event.data) return;
  
  let data = {};
  try { data = event.data.json(); } catch(e) { data = { title: 'Gluco Buddy', body: event.data.text() }; }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Gluco Buddy', {
      body: data.body || '',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: data.tag || 'gluco-buddy',
      data: data.url ? { url: data.url } : {},
      vibrate: [200, 100, 200],
      requireInteraction: data.requireInteraction || false
    })
  );
});

// =============================================
// NOTIFICATIE CLICK
// =============================================
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

console.log('[SW] Gluco Buddy Service Worker geladen ✓');
