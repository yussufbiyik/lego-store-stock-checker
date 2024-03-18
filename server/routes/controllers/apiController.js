const express = require('express');
const { validateToken } = require('../../../utils/auth');
const { checkKeychains } = require('../../../utils/keychains');
const apiRoutes = express.Router();

apiRoutes.get('/check', async (req, res) => {
    validateToken(req, res, () => {
        checkKeychains(req.query.keychainCodes).then((results) => {
            res.json(results);
        });
    });
});

module.exports = apiRoutes;