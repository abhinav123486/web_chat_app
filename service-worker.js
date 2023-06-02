self.addEventListener('push', function(event) {
  const notificationOptions = {
    body: 'This is a notification sent every 1 minute',
    icon: 'images/bg1.png'
  };

  setInterval(function() {
    self.registration.showNotification('Notification Title', notificationOptions);
  }, 60000); // 1 minute in milliseconds
});
