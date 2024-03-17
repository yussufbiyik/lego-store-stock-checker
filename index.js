// Load preffered configuration
const config = require('./config.json');
require('dotenv').config();
// Load the required modules
const { checkKeychains } = require("./utils/keychains.js");
// Get arguments from cli
const args = process.argv.slice(2);
// If no arguments are given, start the server and check the watchlist periodically
if(args.length === 0) {
    const { getSubscribers } = require('./utils/database.js');
    const { initializeExpressServer } = require("./server/server.js");
    const { initializeWebpush, createNotification, sendNotification } = require("./utils/webpush.js");
    console.log("Herhangi bir argüman verilmedi, program izleme listesini kontrol etme modunda çalışıyor.");
    const cron = require('node-cron');
    const app = initializeExpressServer();
    const webpush = initializeWebpush();
    // Schedule the task
    cron.schedule("*/10 * * * * *", async () => {
        // Get subscribers and their watchlists
        const subscribers = await getSubscribers();
        const everySubscriberWatchlist = subscribers.map(subscriber => subscriber.watchlist.split(",")).flat();
        if(everySubscriberWatchlist.length === 0) return console.log("İzleme listesi boş.");
        console.log("İzleme listesi: ", everySubscriberWatchlist);
        console.log('Anahtarlıklar aranıyor...');
        var results = await checkKeychains(everySubscriberWatchlist);
        // Filter the results to only include the ones that are in stock
        results = results.filter(result => result["Stok Durumu"] == "Stokta Var");
        if(results.length > 0) {
            console.log('İzlenen ürünlerden biri veya daha fazlası stokta, bildirim gönderiliyor...');
            // Iterate over the ssubscribers and send a notification
            subscribers.forEach(subscriber => {
                if(!results.some(result=>subscriber.watchlist.includes(result["Kod"]))) return;
                watchedProducts = results.filter(result=>subscriber.watchlist.includes(result["Kod"])).map(result=>result["İsim"]);
                try {
                    sendNotification(
                        JSON.parse(subscriber.subscription), 
                        createNotification(
                            "İzleme listenizdeki bir ya da daha fazla anahtarlık stokta!", 
                            `${watchedProducts.join(",\n")} stokta!`
                        )
                    );
                } catch (err) {
                    console.error("Bildirim gönderilemedi.", err);
                }
            });
            console.table(results);
        }
    });
    return;
}
console.log('Anahtarlıklar aranıyor...');
console.log(checkKeychains(args));