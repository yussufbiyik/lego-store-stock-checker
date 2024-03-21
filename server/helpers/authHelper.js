const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const tokenSecret = process.env.TOKEN_SECRET || "you-should-change-this";

function generateAccessToken(userCredentials) {    
    return jwt.sign(userCredentials, tokenSecret);
}

function validateToken(req, res, next, fail) {
    var token = req.headers['authorization'];
    if  (token == null) if(fail) {fail();return;} else return res.sendStatus(401);
    jwt.verify(token, tokenSecret, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

function hashPassword(username, password) {
    const hash = crypto.createHmac("sha256", username);
    hash.update(password);
    return hash.digest("hex");
}

module.exports = { generateAccessToken, validateToken, hashPassword };