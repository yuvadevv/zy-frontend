self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // We simply pass through the request without caching.
  // This satisfies the PWA install requirement for Chromium browsers
  // but guarantees we do not aggressively cache dynamic Next.js data or sensitive routes.
  // Stale prices or old orders will not be an issue.
  event.respondWith(
    fetch(event.request).catch((err) => {
      // Basic offline fallback could go here
      return new Response("You are currently offline. Please check your internet connection.", {
        status: 503,
        statusText: "Service Unavailable",
        headers: new Headers({
          'Content-Type': 'text/plain'
        })
      });
    })
  );
});
