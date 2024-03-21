const path = require('path');
const { hashPassword, generateAccessToken } = require('./auth');
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database(path.resolve(__dirname, '../server/database/database.db'), sqlite.OPEN_READWRITE, (err) => {if (err) return console.error(err);});

function flushDatabase() {
    db.serialize(() => {
        db.run("DROP TABLE IF EXISTS subscribers");
        db.run("CREATE TABLE subscribers (id INTEGER PRIMARY KEY, username, password, role, subscription, token, watchlist)");
    });
}

const args = process.argv.slice(2);
if(args[0] === "flush") {
    flushDatabase();
    console.log("Database flushed.");
    return;
}

function addSubscriber(req, res) {
    db.get("SELECT * FROM subscribers WHERE subscription = ?", [JSON.stringify(req.body.subscription)], (err, row) => {
        if(err) return console.error(err);
        if(row != undefined) return res.status(400).send("Bu abonelik zaten var.");
        db.serialize(() => {
            const password = hashPassword(req.body.username, req.body.password);
            const accessToken = generateAccessToken(req.body.username);
            db.run(`INSERT INTO subscribers (username, password, role, subscription, token, watchlist) VALUES (?, ?, ?, ?, ?, ?)`, [req.body.username, password, "subscriber", JSON.stringify(req.body.subscription), accessToken, req.body.watchlist], (err) => { console.error(err);return; });
            console.log("Abone eklendi.");
            res.status(200).json({
                message: "Abone eklendi.",
                token: accessToken
            });
        });
    })
}

function getSubscribers() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM subscribers", (err, rows) => {
            if(err) {
                reject(err);
            }
            resolve(rows);
        });
    });
}

module.exports = { db, flushDatabase, addSubscriber, getSubscribers };