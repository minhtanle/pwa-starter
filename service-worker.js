const CACHE_NAME = 'pwa-cache-v1'
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './app.v1.0.0.css',
  './app.v1.0.0.js'
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  )
})
