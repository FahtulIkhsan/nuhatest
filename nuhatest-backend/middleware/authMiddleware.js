const jwt = require('jsonwebtoken');
const { sendJSON } = require('./parser');
require('dotenv').config();

const authenticate = async (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        sendJSON(res, 401, { error: 'Unauthorized: Missing or invalid token' });
        throw new Error('Unauthorized'); 
    }

    try {
        const token = authHeader.split(' ')[1];
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        return true;
    } catch (error) {
        sendJSON(res, 403, { error: 'Forbidden: Invalid or expired token' });
        throw new Error('Forbidden'); 
    }
};

module.exports = { authenticate };