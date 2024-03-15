const path = require('path');
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database(path.resolve(__dirname, '../database/database.db'), sqlite.OPEN_READWRITE, (err) => {if (err) return console.error(err);});

function flushDatabase() {
    db.serialize(() => {
        db.run("DROP TABLE IF EXISTS subscribers");
        db.run("CREATE TABLE subscribers (subscription TEXT)");
    });
}

const args = process.argv.slice(2);
if(args[0] === "flush") {
    flushDatabase();
    console.log("Database flushed.");
    return;
}

function addSubscriber(subscription) {
    db.get("SELECT * FROM subscribers WHERE subscription = ?", [subscription], (err, row) => {
        if(err) return console.error(err);
        if(row != undefined) return console.error("Subscriber already exists.");
        db.serialize(() => {
            console.log("Adding subscriber: ", subscription);
            db.run(`INSERT INTO subscribers (subscription) VALUES (?)`, [subscription]);
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