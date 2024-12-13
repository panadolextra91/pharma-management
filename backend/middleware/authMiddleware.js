const jwt = require('jsonwebtoken');
//authMiddleware.js
// Middleware to verify the JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Authorization Header:', authHeader); // Log the Authorization header
    console.log('Extracted Token:', token); // Log the extracted token

    if (!token) {
        return res.status(401).json({ error: 'Access denied, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        console.log('Decoded Token:', decoded); // Log the decoded payload
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token Verification Error:', error); // Log the error
        res.status(400).json({ error: 'Invalid token' });
    }
};

module.exports = authenticateToken;
