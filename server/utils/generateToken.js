const jwt = require('jsonwebtoken');

let createToken = (data) => {
    let token = jwt.sign({
        data,
    }, process.env.SEED, {expiresIn: process.env.CADUCITY_TOKEN, algorithm:'HS256'});

    return token;
}

module.exports = {
    createToken,
}