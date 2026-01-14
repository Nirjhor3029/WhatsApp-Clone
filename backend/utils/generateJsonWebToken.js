var jwt = require('jsonwebtoken');


const generateJsonWebToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token validity duration
    });
    return token;
}
module.exports = generateJsonWebToken;