const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateTokens = (adminId, adminRole) => {
    const accessToken = jwt.sign(
        { id: adminId, role: adminRole },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
        { id: adminId },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};


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
        if (!process.env.JWT_REFRESH_SECRET) {
            console.warn('JWT_REFRESH_SECRET is not defined. Using JWT_SECRET for refresh tokens. Consider defining a separate secret for better security.');
        }

        const { accessToken, refreshToken } = generateTokens(admin._id, admin.role);

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

        admin.refreshToken = hashedRefreshToken;
        await admin.save();
        console.log('Refresh token stored for admin:', admin._id);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/api/admin'
        });

        console.log('Login successful for username:', username);
        res.json({ accessToken });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.refreshAdminToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) {
        console.log('No refresh token cookie found.');
        return res.status(401).json({ message: 'Unauthorized: No refresh token' });
    }

    const refreshToken = cookies.refreshToken;
    console.log('Refresh token received:', refreshToken ? '[REDACTED]' : 'None');

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
        );

        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            console.log('Admin not found for decoded refresh token.');
            return res.status(403).json({ message: 'Forbidden: Invalid admin for refresh token' });
        }

        const isRefreshTokenMatch = await bcrypt.compare(refreshToken, admin.refreshToken);
        if (!isRefreshTokenMatch) {
            console.log('Refresh token mismatch in database for admin:', admin._id);
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Lax',
                path: '/api/admin'
            });
            admin.refreshToken = null;
            await admin.save();
            return res.status(403).json({ message: 'Forbidden: Invalid refresh token' });
        }

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(admin._id, admin.role);

        const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
        admin.refreshToken = hashedNewRefreshToken;
        await admin.save();
        console.log('New refresh token stored for admin:', admin._id);

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/api/admin'
        });

        console.log('Access token refreshed for admin:', admin._id);
        res.json({ accessToken });
    } catch (err) {
        console.error('Refresh token error:', err.message);
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            path: '/api/admin'
        });
        // Corrected: Respond with 403 Forbidden for a truly invalid token
        res.status(403).json({ message: 'Forbidden: Refresh token invalid or expired' });
    }
};

exports.logout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) {
        return res.sendStatus(204);
    }

    const refreshToken = cookies.refreshToken;

    try {
        // Find admin by the refresh token
        const admin = await Admin.findOne({ 'refreshToken': { $ne: null } });
        if (!admin) {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Lax',
                path: '/api/admin'
            });
            return res.sendStatus(204);
        }

        // This is a bug in my previous logic: this finds any admin with a refresh token, not the right one.
        // We should instead find the admin based on the token itself.
        let isCorrectAdmin = false;
        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
            isCorrectAdmin = decoded.id; // Corrected: This would be the admin id.
        } catch (e) {
            console.log('Logout attempted with an invalid token:', e.message);
        }

        const correctAdmin = isCorrectAdmin ? await Admin.findById(isCorrectAdmin) : null;

        if (correctAdmin && await bcrypt.compare(refreshToken, correctAdmin.refreshToken)) {
            correctAdmin.refreshToken = null;
            await correctAdmin.save();
            console.log('Refresh token cleared from DB for admin:', correctAdmin._id);
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            path: '/api/admin'
        });
        res.sendStatus(204);
    } catch (err) {
        console.error('Logout error:', err.message);
        res.status(500).json({ message: err.message });
    }
};
