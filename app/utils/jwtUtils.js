const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (email) => {
    const payload = { email };
    const secretKey = process.env.JWT_SECRET;
    return jwt.sign(payload, secretKey, { expiresIn: '12h' });
};

const verifyToken = (token) => {
    try {
        const secretKey = process.env.JWT_SECRET;
        return jwt.verify(token, secretKey);
    } catch (err) {
        return null;
    }
};

module.exports = { generateToken, verifyToken };
