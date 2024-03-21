const express = require('express');
const { addSubscriber } = require("../../helpers/databaseHelper");
const subscriptionRoutes = express.Router();

subscriptionRoutes.post('/subscribe', (req, res) => {
    addSubscriber(req, res);
});

module.exports = subscriptionRoutes;