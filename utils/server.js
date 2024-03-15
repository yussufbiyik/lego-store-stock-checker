const path = require('path');
// Load preffered configuration
const config = require('../config.json');
const { addSubscriber } = require('./database.js');

var savedSubscription;
function initializeExpressServer() {
    const express = require('express');
    const bodyParser = require('body-parser');
    const app = express();
    app.use(bodyParser.json());
    const PORT = config.server.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
    app.use(express.static('public'));
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/main/index.html'));
    });
    app.post('/subscribe', (req, res) => {
        savedSubscription = req.body;
        addSubscriber(JSON.stringify(savedSubscription));
        res.status(201).send("<h1>Abone oldunuz!</h1>");
    });
    return app;
}

module.exports = {
    initializeExpressServer
};