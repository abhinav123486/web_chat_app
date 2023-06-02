self.addEventListener('install', function(event) {
  // Perform any necessary setup or caching here
});

self.addEventListener('activate', function(event) {
  // Clean up any outdated caches or resources here
});

self.addEventListener('fetch', function(event) {
  // Handle fetch events or perform any custom network logic here
});

self.addEventListener('push', function(event) {
  const notificationOptions = {
    body: 'This is a notification sent every 1 minute',
    icon: '/path/to/notification-icon.png'
  };

  setInterval(function() {
    self.registration.showNotification('Notification Title', notificationOptions);
  }, 60000); // 1 minute in milliseconds
});
