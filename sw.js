/* ============================================================
   Events Café — Service Worker (PWA)
   But : rendre l'app installable et utilisable hors-ligne (coquille),
   SANS jamais interférer avec Firebase (temps réel) ni EmailJS.
   ============================================================ */
const CACHE = 'events-cafe-v5';
const APP_SHELL = [
  './',
  './index.html',
  './formulaire.html',
  './firebase-config.js',
  './manifest.webmanifest',
  './icon.svg'
];

// Installation : on met en cache la coquille de l'app
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

// Activation : on nettoie les anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // On ne touche QU'aux ressources de notre propre origine.
  // Tout le reste (Firebase, EmailJS, Google Fonts, CDN) passe directement
  // au réseau pour ne jamais casser la synchronisation temps réel.
  if (url.origin !== self.location.origin) return;

  // firebase-config.js : réseau d'abord (la config email/Firebase peut changer,
  // on ne veut jamais servir une version périmée depuis le cache).
  if (url.pathname.endsWith('firebase-config.js')) {
    event.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); return res; })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Navigation (ouverture de page) : réseau d'abord, cache en secours (hors-ligne)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // Autres ressources locales : cache d'abord, puis réseau (et mise en cache)
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => cached);
    })
  );
});

// Clic sur une notification : on remet l'app au premier plan
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./index.html');
    })
  );
});
