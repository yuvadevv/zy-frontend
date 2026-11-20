// BLINTZY PWA & Push Notification Service Worker
// Combines PWA caching with Firebase Cloud Messaging / Web Push delivery

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// PWA Pass-Through Fetch Handler
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
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

// Push Notification Delivery Listener (Background & Foreground)
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { notification: { title: 'BLINTZY Update', body: event.data.text() } };
    }
  }

  const notification = data.notification || data;
  const title = notification.title || 'BLINTZY Campus Update';
  const targetUrl = data.data?.url || data.data?.click_action || notification.click_action || '/app';

  const options = {
    body: notification.body || notification.message || 'You have a new update from BLINTZY.',
    icon: notification.icon || '/icons/icon-192x192.png',
    badge: notification.badge || '/icons/badge-72x72.png',
    image: notification.image || notification.imageUrl || undefined,
    data: {
      url: targetUrl,
      ...data.data
    },
    vibrate: [200, 100, 200],
    tag: notification.tag || `blintzy_${Date.now()}`,
    renotify: true
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Push Notification Click Action & Smart Window Routing
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/app';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 1. If an existing app window is open, navigate and focus it
      for (const client of clientList) {
        if (client.url && client.url.includes(self.location.origin) && 'focus' in client) {
          if ('navigate' in client) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      // 2. Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
