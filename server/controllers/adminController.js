const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt for username:', username);

    try {
        const admin = await Admin.findOne({ username });

        if (!admin) {
            console.log('Admin not found for username:', username);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log('Admin found:', admin.username);
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            console.log('Password mismatch for username:', username);
            return res.status(401).json({ message: 'Invalid credentials' });
        }


        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined in environment variables!');
            return res.status(500).json({ message: 'Server configuration error: JWT secret missing.' });
        }
        console.log('JWT_SECRET is defined.');


        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '15d' });
        console.log('Login successful for username:', username);
        res.json({ token });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ message: err.message });
    }
};