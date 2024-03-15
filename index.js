// Load preffered configuration
const config = require('./config.json');
const WATCHLIST = config.watchlist;
const LEGO_STORE_LINK = config.legoStoreLink;
const CHECK_INTERVAL = config.checkIntervalAsCron;
// Load the required modules
const { initializeExpressServer } = require("./utils/server.js");
const { initializeWebpush, createNotification, sendNotification } = require("./utils/webpush.js");
const { checkKeychains } = require("./utils/keychains.js");
const { getSubscribers } = require('./utils/database.js');

// Get arguments from cli
const args = process.argv.slice(2);
// If no arguments are given, start the server and check the watchlist periodically
if(args.length === 0) {
    console.log("Herhangi bir argüman verilmedi, program izleme listesini kontrol etme modunda çalışıyor.");
    const cron = require('node-cron');
    const app = initializeExpressServer();
    const webpush = initializeWebpush();
    // Schedule the task
    cron.schedule("*/10 * * * * *", async () => {
        console.log('Anahtarlıklar aranıyor...');
        var results = await checkKeychains(WATCHLIST);
        if(results.length > 0) {
            console.table(results);
            console.log('İzlenen ürünlerden biri veya daha fazlası stokta, bildirim gönderiliyor...');
            try {
                getSubscribers().then(subscribers => {
                    subscribers.forEach(subscriber => {
                        sendNotification(
                            JSON.parse(subscriber.subscription), 
                            createNotification(
                                "İzleme listenizdeki bir ya da daha fazla anahtarlık stokta!", 
                                `${results.map(r => r["İsim"]).join(",\n")} stokta!`
                            )
                        );
                    });
                });
            } catch (err) {
                console.error("Bildirim gönderilemedi.", err);
            }
        }
    });
    return;
}
console.log('Anahtarlıklar aranıyor...');
console.log(checkKeychains(args));