const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const { initializeRoutes } = require("./routes/routes");

function initializeExpressServer() {
    const app = express();
    app.use(bodyParser.json());
    app.use(express.static('public'));
    const PORT = process.env.PORT || 3000;
    initializeRoutes(app);
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
    return app;
}

module.exports = {
    initializeExpressServer
};