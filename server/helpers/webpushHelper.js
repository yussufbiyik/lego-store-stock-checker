var webpush;

function createVAPIDKeys() {
    const webpush = require('web-push');
    const vapidKeys = webpush.generateVAPIDKeys();
    console.log("VAPID Keys generated: ", vapidKeys);
}

const args = process.argv.slice(2);
if(args[0] === "create") {
    createVAPIDKeys();
    return;
}

function initializeWebpush() {
    webpush = require('web-push');
    webpush.setVapidDetails(
        "mailto:" + process.env.MAIL,
        process.env.PUBLIC_VAPID_KEY,
        process.env.PRIVATE_VAPID_KEY
    );
    return webpush;
}

function createNotification (title, body) {
    return JSON.stringify({
        title: title,
        body: body,
        icon: '../public/assets/LEGO_logo.svg.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '2'
        },
        actions: [
            {
                action: 'explore', 
                title: 'Satın Al',
            },
            {
                action: 'close', 
                title: 'Boşver',
            },
        ]
    })
}

function sendNotification(subscription, notification) {
    webpush.sendNotification(subscription, notification)
        .then(() => console.log("Bildirim gönderildi."))
        .catch(err => console.error("Bildirim gönderilemedi.", err));
}

module.exports = { initializeWebpush, createNotification, sendNotification };