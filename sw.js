// Gluco Buddy - Service Worker
// Versie: 30.0.0 — debug opslaan verificatie

const CACHE_NAME = 'gluco-buddy-v40';
const RUNTIME_CACHE = 'gluco-buddy-runtime-v26';

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
const VAPID_PUBLIC_KEY = 'BDsoPhra_iC5S-vFCBeym3mHp7mVfzSG54TCwY8lRXmbWo3l78cNxleLQX2Fwko4JMfmt7sGUEAf1Gw-rK2VQhc';

function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64  = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  var rawData = atob(base64);
  var outputArray = new Uint8Array(rawData.length);
  for (var i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

self.addEventListener('pushsubscriptionchange', event => {
  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
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

console.log('[SW] Gluco Buddy Service Worker v30.0 geladen ✓');
