const jwt = require('jsonwebtoken');

exports.adminAuth = (req, res, next) => {
    // Get the full authorization header
    const authHeader = req.headers['authorization'];
    console.log('Auth middleware - Full Header:', authHeader);

    // Check if the header exists and is in the correct "Bearer" format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. Token is missing or malformed.' });
    }

    // --- THIS IS THE FIX ---
    // Extract the actual token from the "Bearer <token>" string
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. Token is missing.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('Auth middleware - Invalid token:', err.message);
            // Provide a more specific error if the token is expired
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token has expired. Please log in again.' });
            }
            return res.status(401).json({ message: 'Invalid token.' });
        }

        console.log('Auth middleware - Decoded:', decoded);

        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admin access required.' });
        }

        req.user = decoded;
        next();
    });
};