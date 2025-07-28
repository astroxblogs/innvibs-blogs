const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt for username:', username); // Log the username being attempted

    try {
        const admin = await Admin.findOne({ username });

        if (!admin) {
            console.log('Admin not found for username:', username); // Log if admin is not found
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log('Admin found:', admin.username); // Log if admin is found
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            console.log('Password mismatch for username:', username); // Log if password mismatch
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if JWT_SECRET is loaded
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined in environment variables!'); // CRITICAL: Log if secret is missing
            return res.status(500).json({ message: 'Server configuration error: JWT secret missing.' });
        }
        console.log('JWT_SECRET is defined.'); // Confirm secret is present

        const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '15d' });
        console.log('Login successful for username:', username); // Log successful login
        res.json({ token });
    } catch (err) {
        console.error('Login error:', err.message); // Log any unexpected errors
        res.status(500).json({ message: err.message });
    }
};