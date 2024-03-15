self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    var action = event.action;
    if (action === 'explore') {
        clients.openWindow('https://lego.storeturkey.com.tr/anahtarlik?ps=100');
    }
}, false);

self.addEventListener('push', (event) => {
    console.log('Push message received', event.data.json());
    event.waitUntil(
        self.registration.showNotification('Aradığın anaharlık stokta!', event.data.json())
    );
});