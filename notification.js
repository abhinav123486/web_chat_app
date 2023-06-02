/** Send Notifications to Users */
if ("Notification" in window && "serviceWorker" in navigator) {
    Notification.requestPermission((stat) => {
        if (stat === "granted") {
            var worker = navigator.serviceWorker.register('service-worker.js').then((val) => {
                
            }).catch((err) => {console.log(err)});
        }
    });
} else {
    throw new Error("Service Worker isn't supported in your browser");
}