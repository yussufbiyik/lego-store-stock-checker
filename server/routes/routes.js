const keychainRoutes = require("./controllers/keychainController");
const mainRoutes = require("./controllers/mainController");
const subscriptionRoutes = require("./controllers/subscriptionController");

function initializeRoutes(app) {
    app.use('/', mainRoutes);
    app.use('/', subscriptionRoutes);
    app.use('/', keychainRoutes)
}

module.exports = { initializeRoutes };