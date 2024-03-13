const cron = require('node-cron');

const axios = require('axios');
const cheerio = require('cheerio');

const config = require('./config.json');
const LEGO_STORE_LINK = config.legoStoreLink;
const CHECK_INTERVAL = config.checkIntervalAsCron;
const WATCHLIST = config.watchlist;

function checkKeychains(args) {
    const results = []
    axios.get(LEGO_STORE_LINK)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            // Find all keychains
            const elements = $(".col.col-12.hover-box.drop-down.hover");
            console.log(`${elements.length} anahtarlık bulundu, ${args.join(",")} aranıyor.`)
            // Iterate over all keychains
            elements.each((index, element) => {
                // Get the full name of the keychain and split it by spaces
                const keychainFull = $(element).find(".col.col-12.vitrin-product-name.detailLink").attr("title").split(" ");
                // Remove the first element from the array and assign it to keychainCode
                const keychainCode = keychainFull.shift();
                // If the keychain code is not in the arguments, skip this iteration
                if(!args.includes(keychainCode)) return;;
                const keyChainPrice = $(element).find(".vitrin-current-price.currentPrice").text().trim().replace("\n", " ") || "Fiyat Yok";
                let isOutOfStock = false;
                keychainFull.pop(); // Remove "Anahtarlık" word
                const keychainName = keychainFull.join(" ");
                // Check if the keychain is in stocks, not being in stock, 
                // not being in production are almost the same thing so there's no need to distinguish it.
                if($(element).find('.out-of-stock').length != 0) isOutOfStock = true;
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
    console.log("Herhangi bir argüman verilmedi, program izleme listesi modunda çalışıyor.");
    cron.schedule(CHECK_INTERVAL, () => {
        console.log('Checking for the keychains...');
        checkKeychains(WATCHLIST);
    });
    return;
}
checkKeychains(args);