const express = require('express');
const mainRoutes = express.Router();
const path = require('path');

mainRoutes.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../public/main/index.html'));
});

module.exports = mainRoutes;