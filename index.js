const cron = require('node-cron');

const axios = require('axios');
const cheerio = require('cheerio');

const config = require('./config.json');
const WATCHLIST = config.watchlist;
const LEGO_STORE_LINK = config.legoStoreLink;
const CHECK_INTERVAL = config.checkIntervalAsCron;

function getKeychainInfoElement($, element) {
    return $(element).find(".col.col-12.vitrin-product-name.detailLink").attr("title").split(" ");
}

function getKeychainCode(keychainInfoElement) {
    return keychainInfoElement.shift();
}

function getKeychainName(keychainInfoElement) {
    keychainInfoElement.pop(); // Remove "Anahtarlık" word
    return keychainInfoElement.join(" ");
}

function getKeychainPrice($, element) {
    return $(element).find(".vitrin-current-price.currentPrice").text().trim().replace("\n", " ") || "Fiyat Yok";
}

function checkKeychains(args) {
    const results = []
    axios.get(LEGO_STORE_LINK)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            // Find all keychains
            const keychains = $(".col.col-12.hover-box.drop-down.hover");
            console.log(`${keychains.length} anahtarlık bulundu, ${args.join(",")} kodlu anahtarlıklar aranıyor.`)
            // Iterate over all keychains
            keychains.each((index, keychain) => {
                // Get the full name of the keychain and split it by spaces
                const keychainInfoElement = getKeychainInfoElement($, keychain);
                // Remove the first element from the array and assign it to keychainCode
                const keychainCode = getKeychainCode(keychainInfoElement);
                // If the keychain code is not in the arguments, skip this iteration
                if(args[0] != 0 && !args.includes(keychainCode)) return;
                const keyChainPrice = getKeychainPrice($, keychain) || "Fiyat Yok";
                let isOutOfStock = false;
                keychainInfoElement.pop(); // Remove "Anahtarlık" word
                const keychainName = keychainInfoElement.join(" ");
                // Check if the keychain is in stocks, not being in stock, 
                // not being in production are almost the same thing so there's no need to distinguish it.
                if($(keychain).find('.out-of-stock').length != 0) isOutOfStock = true;
                results.push({ 
                    "Kod": keychainCode, 
                    "İsim": keychainName, 
                    "Fiyat": keyChainPrice,
                    "Stok Durumu": isOutOfStock ? "Stokta Yok" : "Stokta Var"
                });
            });
            // Print the results as a table
            console.table(results);
        })
        .catch(error => {
            console.error('Hata:', error);
        });
}

// Get arguments from cli
const args = process.argv.slice(2);
if(args.length === 0) {
    console.log("Herhangi bir argüman verilmedi, program izleme listesini kontrol etme modunda çalışıyor.");
    cron.schedule(CHECK_INTERVAL, () => {
        console.log('Checking for the keychains...');
        checkKeychains(WATCHLIST);
    });
    return;
}
checkKeychains(args);