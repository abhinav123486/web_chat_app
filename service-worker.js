self.addEventListener('push', function(event) {
  const options = {
    body: 'This is a push notification.',
    icon: 'images/bg1.png'
  };

  event.waitUntil(
    self.registration.showNotification('Notification Title', options)
  );
});

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

function sendNotification() {
  const options = {
    body: 'This is a push notification.',
    icon: 'path/to/icon.png'
  };

  self.registration.showNotification('Notification Title', options);
}

setInterval(sendNotification, 60000);
