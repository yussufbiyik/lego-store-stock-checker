const axios = require('axios');
const cheerio = require('cheerio');

const LEGO_STORE_LINK = "https://lego.storeturkey.com.tr/anahtarlik?ps=100";
// Selectors for the keychain elements
const KEYCHAIN_SELECTOR = ".col.col-12.hover-box.drop-down.hover";
const KEYCHAIN_INFO_SELECTOR = ".col.col-12.vitrin-product-name.detailLink";
const KEYCHAIN_PRICE_SELECTOR = ".vitrin-current-price.currentPrice";

class Keychain {
    constructor(code, name, price, isOutOfStock) {
        this["Kod"] = code;
        this["İsim"] = name;
        this["Fiyat"] = price;
        this["Stok Durumu"] = isOutOfStock ? "Stokta Yok" : "Stokta Var";
    }
}

function getKeychainInfoElement($, element) {
    // Get the full name of the keychain and split it by spaces
    return $(element).find(KEYCHAIN_INFO_SELECTOR).attr("title").split(" ");
}

function getKeychainCode(keychainInfoElement) {
    // Remove the first element from the array and assign it to keychainCode
    return keychainInfoElement.shift();
}

function getKeychainName(keychainInfoElement) {
    keychainInfoElement.pop(); // Remove "Anahtarlık" word
    return keychainInfoElement.join(" ");
}

function getKeychainPrice($, element) {
    return $(element).find(KEYCHAIN_PRICE_SELECTOR).text().trim().replace("\n", " ") || "Fiyat Yok";
}

async function checkKeychains(args) {
    const results = []
    await axios.get(LEGO_STORE_LINK)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            // Find all keychains
            const keychains = $(KEYCHAIN_SELECTOR);
            console.log(`${keychains.length} anahtarlık bulundu.`)
            // Iterate over all keychains
            keychains.each((index, keychain) => {
                const keychainInfoElement = getKeychainInfoElement($, keychain);
                const keychainCode = getKeychainCode(keychainInfoElement);
                // If the keychain code is not in the arguments, skip this iteration
                if(args[0] != 0 && !args.includes(keychainCode)) return;
                const keychainName = getKeychainName(keychainInfoElement);
                const keyChainPrice = getKeychainPrice($, keychain) || "Fiyat Yok";
                let isOutOfStock = false;
                // Check if the keychain is in stock, not being in stock and 
                // not being in production are almost the same thing so there's no need to distinguish it.
                if($(keychain).find(".out-of-stock").length != 0) isOutOfStock = true;
                results.push(new Keychain(keychainCode, keychainName, keyChainPrice, isOutOfStock));
            });
            console.log("Arama tamamlandı.");
        })
        .catch(error => {
            console.error('Hata:', error);
        });
        return results;
}

module.exports = {
    checkKeychains
};