const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const { initializeRoutes } = require("./routes/routes");

// Load preffered configuration
const config = require('../config.json');

function initializeExpressServer() {
    const app = express();
    app.use(bodyParser.json());
    const PORT = config.server.PORT || 3000;
    initializeRoutes(app);
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
    app.use(express.static('public'));
    return app;
}

module.exports = {
    initializeExpressServer
};