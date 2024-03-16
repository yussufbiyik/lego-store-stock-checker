const mainRoutes = require("./controllers/mainController");
const subscriptionRoutes = require("./controllers/subscriptionController");

function initializeRoutes(app) {
    app.use('/', mainRoutes);
    app.use('/', subscriptionRoutes);
}

module.exports = { initializeRoutes };