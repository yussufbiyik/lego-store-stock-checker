const express = require('express');
const { validateToken } = require('../../helpers/authHelper');
const { checkKeychains } = require('../../../utils/keychains');
const keychainRoutes = express.Router();

keychainRoutes.get('/check', async (req, res) => {
    validateToken(req, res, () => {
        checkKeychains(req.query.keychainCodes).then((results) => {
            res.json(results);
        });
    });
});

module.exports = keychainRoutes;