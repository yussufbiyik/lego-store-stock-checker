const path = require('path');
const { hashPassword } = require('./auth');
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database(path.resolve(__dirname, '../server/database/database.db'), sqlite.OPEN_READWRITE, (err) => {if (err) return console.error(err);});

function flushDatabase() {
    db.serialize(() => {
        db.run("DROP TABLE IF EXISTS users");
        db.run("CREATE TABLE users (username, password, role, subscription)");
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
        if(row != undefined) return console.error("Subscriber already exists.");
        db.serialize(() => {
            const password = hashPassword(req.body.username, req.body.password);
            console.log("Adding subscriber: ", req.body.subscibtion);
            db.run(`INSERT INTO users (username, password, role, subscription) VALUES (?, ?, ?, ?)`, [req.body.username, password, "subscriber", JSON.stringify(req.body.subscription)], (err) => { console.error(err);return; });
            console.log("Subscriber added.");
            res.status(200).send("Subscriber added.");
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