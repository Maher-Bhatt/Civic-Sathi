const CACHE = "civic-sathi-admin-shell-v2";
const SHELL = [
  "/",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-192.png",
  "/icon-maskable-512.png",
  "/brand/civic-sathi-app-icon-192.png",
  "/brand/civic-sathi-app-icon-512.png",
  "/brand/civic-sathi-app-icon-maskable-192.png",
  "/brand/civic-sathi-app-icon-maskable-512.png",
];
self.addEventListener("install", (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener("activate", (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin || request.url.includes("/api/") || request.url.includes("/_server/")) return;
  event.respondWith(fetch(request).catch(() => caches.match(request).then((cached) => cached || caches.match("/"))));
});
