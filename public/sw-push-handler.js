// ==============================================================================
// Service Worker Push Notification & Click Handlers
// ==============================================================================

self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const payload = event.data.json();
    const title = payload.title || 'Subscription Reminder';
    const options = {
      body: payload.body || 'You have an upcoming subscription renewal.',
      icon: '/icon.svg',
      badge: '/favicon.svg',
      data: {
        url: payload.url || '/',
      },
      tag: payload.tag || 'subscription-reminder',
      renotify: true,
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch {
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification('Subscription Reminder', {
        body: text,
        icon: '/icon.svg',
      })
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus open client window if available
      for (const client of clientList) {
        if (client.url.includes(self.registration.scope) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
