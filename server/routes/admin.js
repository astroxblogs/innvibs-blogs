// server/routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// --- ADD THESE DEBUG LOGS ---
const authModule = require('../middleware/auth'); // Capture the entire module export
console.log('DEBUG: authModule received:', authModule); // Log what require returns
const { adminAuth } = authModule; // Then destructure
console.log('DEBUG: adminAuth type:', typeof adminAuth); // Log the type of adminAuth
// --- END DEBUG LOGS ---

const blogController = require('../controllers/blogController');
console.log('DEBUG: blogController object:', blogController);

router.post('/login', adminController.login);

router.get('/verify-token', adminAuth, (req, res) => {
    res.status(200).json({ message: 'Token is valid', isAdmin: true });
});

router.post('/blogs', adminAuth, blogController.createBlog);
router.put('/blogs/:id', adminAuth, blogController.updateBlog);
router.delete('/blogs/:id', adminAuth, blogController.deleteBlog);
router.get('/blogs', adminAuth, blogController.getLatestBlogs);

module.exports = router;