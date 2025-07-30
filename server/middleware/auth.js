const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');  

exports.adminAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. Token is missing or malformed.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. Token is missing.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => { // ADDED 'async' here
        if (err) {
            console.log('Auth middleware - Invalid token:', err.message);
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token has expired. Please log in again.' });
            }
            return res.status(401).json({ message: 'Invalid token.' });
        }

      
        try {
            const admin = await Admin.findById(decoded.id);  

            if (!admin) {
                console.log('Auth middleware - User from token not found in DB:', decoded.id);
                return res.status(401).json({ message: 'Unauthorized: User no longer exists.' });
            }

            if (admin.role !== 'admin') {  
                console.log('Auth middleware - User from token is not an admin:', decoded.id);
                return res.status(403).json({ message: 'Forbidden: Admin access required.' });
            }

            req.user = decoded;  
            next();
        } catch (dbErr) {
            console.error('Auth middleware - Database error during user check:', dbErr.message);
            return res.status(500).json({ message: 'Server error during authentication.' });
        }
    });
};