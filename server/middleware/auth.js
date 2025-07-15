const jwt = require('jsonwebtoken');

exports.adminAuth = (req, res, next) => {
    const token = req.headers['authorization'];
    console.log('Auth middleware - Token:', token);
    if (!token) return res.status(401).json({ message: 'No token provided' });
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('Auth middleware - Invalid token:', err.message);
            return res.status(401).json({ message: 'Invalid token' });
        }
        console.log('Auth middleware - Decoded:', decoded);
        if (decoded.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
        req.user = decoded;
        next();
    });
}; 