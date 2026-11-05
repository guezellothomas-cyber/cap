// Cap : fonctionnement hors connexion
const CACHE = 'cap-1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './data/map.e8441f0251.js', './data/ciq.4851f4535d.js', './data/mic.995a607510.js', './data/b3.c3c88bdf05.js', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './icons/favicon-64.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
const warmNews = () => caches.open(CACHE).then(c => fetch('news/index.json', { cache: 'no-store' }).then(r => r.ok ? (c.put('news/index.json', r.clone()), r.json()) : { dates: [] })
  .then(i => Promise.all((i.dates || []).slice(0, 30).map(d => fetch('news/' + d + '.json').then(r => r.ok && c.put('news/' + d + '.json', r)))))).catch(() => {});
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(warmNews).then(() => self.clients.claim())); });
const store = (req, res) => { if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; };
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Le carnet muscu (muscu/) a son propre service worker
  if (url.origin === location.origin && url.pathname.includes('/muscu/')) return;
  // Actualité : toujours la version la plus récente, le cache sert hors connexion
  if (url.origin === location.origin && url.pathname.includes('/news/')) { e.respondWith(fetch(req, { cache: 'no-store' }).then(r => store(req, r)).catch(() => caches.match(req))); return; }
  // Polices : cache d'abord
  if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) { e.respondWith(caches.match(req).then(m => m || fetch(req).then(r => store(req, r)))); return; }
  // Page de l'appli : toujours la dernière version en ligne, la copie en cache sert hors connexion
  if (req.mode === 'navigate' || (url.origin === location.origin && /\/(index\.html)?$/.test(url.pathname))) {
    e.respondWith(fetch(req, { cache: 'no-store' }).then(r => store(req, r)).catch(() => caches.match(req, { ignoreSearch: true }).then(m => m || caches.match('./index.html')))); return; }
  // Icônes et manifeste : cache d'abord, mis à jour en arrière-plan
  if (url.origin === location.origin) { e.respondWith(caches.match(req, { ignoreSearch: true }).then(m => { const net = fetch(req).then(r => store(req, r)).catch(() => m); return m || net; })); }
});
