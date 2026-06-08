// ================================================
// PlantAI - Offline Service Worker
// ================================================

const CACHE_NAME = 'plantai-cache-v1';
const ASSETS = [
  './',
  'index.html',
  'detect.html',
  'dashboard.html',
  'map.html',
  'chatbot.html',
  'auth.html',
  'main.css',
  'detect.css',
  'dashboard.css',
  'map.css',
  'chatbot_page.css',
  'auth.css',
  'data.js',
  'particles.js',
  'lang.js',
  'chatbot.js',
  'detect.js',
  'dashboard.js',
  'map.js',
  'auth.js',
  'chatbot_page.js',
  'home.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).catch(err => console.log("SW Asset caching failed: ", err))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
