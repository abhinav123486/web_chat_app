function displayNotification(title, body) {
  var icon = "images/favicon.ico";
  var notification = new Notification(title, {body:body, icon:icon});
  setTimeout(() => {
    notification.close();
  }, 5000);
}
