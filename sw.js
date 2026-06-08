// ================================================
// PlantAI - Offline Service Worker
// ================================================

const CACHE_NAME = 'plantai-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/detect.html',
  '/dashboard.html',
  '/map.html',
  '/chatbot.html',
  '/auth.html',
  '/css/main.css',
  '/css/detect.css',
  '/css/dashboard.css',
  '/css/map.css',
  '/css/chatbot_page.css',
  '/css/auth.css',
  '/js/data.js',
  '/js/particles.js',
  '/js/lang.js',
  '/js/chatbot.js',
  '/js/detect.js',
  '/js/dashboard.js',
  '/js/map.js',
  '/js/auth.js',
  '/js/chatbot_page.js',
  '/js/home.js'
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
