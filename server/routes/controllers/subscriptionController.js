const express = require('express');
const { addSubscriber } = require('../../../utils/database');
const subscriptionRoutes = express.Router();

subscriptionRoutes.post('/subscribe', (req, res) => {
    addSubscriber(req, res);
});

module.exports = subscriptionRoutes;