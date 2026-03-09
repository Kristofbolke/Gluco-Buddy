// Gluco Buddy - Service Worker
// Versie: 4.0.0 — Web Push ingeschakeld

const CACHE_NAME = 'gluco-buddy-v4';
const RUNTIME_CACHE = 'gluco-buddy-runtime-v4';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// =============================================
// INSTALLATIE
// =============================================
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch(err => console.warn('[SW] Pre-cache fout (niet fataal):', err))
  );
});

// =============================================
// ACTIVATIE
// =============================================
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// =============================================
// FETCH - Stale-While-Revalidate
// =============================================
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.hostname.includes('supabase') ||
      url.hostname.includes('googleapis') ||
      url.hostname.includes('jsdelivr') ||
      request.method !== 'GET') {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match('/index.html') || caches.match('/'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        fetch(request).then(networkResponse => {
          if (networkResponse && networkResponse.ok) {
            caches.open(RUNTIME_CACHE).then(cache => cache.put(request, networkResponse.clone()));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(request).then(response => {
        if (!response || !response.ok) return response;
        const clone = response.clone();
        caches.open(RUNTIME_CACHE).then(cache => cache.put(request, clone));
        return response;
      }).catch(() => {
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
// PUSH NOTIFICATIES — ontvangen
// =============================================
self.addEventListener('push', event => {
  if (!event.data) return;

  let data = {};
  try {
    data = event.data.json();
  } catch(e) {
    data = { title: 'Gluco Buddy', body: event.data.text() };
  }

  const options = {
    body:               data.body || '',
    icon:               data.icon || '/icons/icon-192x192.png',
    badge:              '/icons/icon-72x72.png',
    tag:                data.tag  || 'gluco-buddy',
    data:               { url: data.url || '/' },
    vibrate:            [200, 100, 200],
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Gluco Buddy', options)
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
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// =============================================
// PUSH SUBSCRIPTION CHANGE (auto-hernieuw)
// =============================================
self.addEventListener('pushsubscriptionchange', event => {
  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: self.VAPID_PUBLIC_KEY
    }).then(subscription => {
      // Stuur nieuwe subscription naar Supabase via postMessage
      self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage({
          type: 'PUSH_SUBSCRIPTION_CHANGED',
          subscription: subscription.toJSON()
        }));
      });
    })
  );
});

console.log('[SW] Gluco Buddy Service Worker v4.0 geladen ✓');
