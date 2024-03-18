const path = require('path');
const { hashPassword } = require('./auth');
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database(path.resolve(__dirname, '../server/database/database.db'), sqlite.OPEN_READWRITE, (err) => {if (err) return console.error(err);});

function flushDatabase() {
    db.serialize(() => {
        db.run("DROP TABLE IF EXISTS users");
        db.run("CREATE TABLE users (username, password, role, subscription, watchlist)");
    });
}

const args = process.argv.slice(2);
if(args[0] === "flush") {
    flushDatabase();
    console.log("Database flushed.");
    return;
}

function addSubscriber(req, res) {
    db.get("SELECT * FROM users WHERE subscription = ?", [JSON.stringify(req.body.subscription)], (err, row) => {
        if(err) return console.error(err);
        if(row != undefined) return res.status(400).send("Bu abonelik zaten var.");
        db.serialize(() => {
            const password = hashPassword(req.body.username, req.body.password);
            console.log("Abone ekleniyor...");
            db.run(`INSERT INTO users (username, password, role, subscription, watchlist) VALUES (?, ?, ?, ?, ?)`, [req.body.username, password, "subscriber", JSON.stringify(req.body.subscription), req.body.watchlist], (err) => { console.error(err);return; });
            console.log("Abone eklendi.");
            res.status(200).send("Abone eklendi.");
        });
    })
}

function getSubscribers() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM users", (err, rows) => {
            if(err) {
                reject(err);
            }
            resolve(rows);
        });
    });
}

module.exports = { db, flushDatabase, addSubscriber, getSubscribers };