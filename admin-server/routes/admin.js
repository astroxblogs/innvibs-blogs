// server/routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const blogController = require('../controllers/blogController');
const categoryController = require('../controllers/categoryController');
const { adminAuth } = require('../middleware/auth');

// Admin Authentication Routes
router.post('/login', adminController.login);
router.post('/refresh-token', adminController.refreshAdminToken);
router.post('/logout', adminController.logout);
router.get('/verify-token', adminAuth, (req, res) => {
    res.status(200).json({ message: 'Token is valid', isAdmin: true });
});

// Blog Management Routes (protected)
router.post('/blogs', adminAuth, blogController.createBlog);
router.put('/blogs/:id', adminAuth, blogController.updateBlog);
router.delete('/blogs/:id', adminAuth, blogController.deleteBlog);
router.get('/blogs', adminAuth, blogController.getLatestBlogs);

// Category Management Routes (protected) // <-- NEW ROUTES
router.post('/categories', adminAuth, categoryController.createCategory);
router.get('/categories', adminAuth, categoryController.getCategories);
router.delete('/categories/:id', adminAuth, categoryController.deleteCategory); // <-- NEW DELETE ROUTE

module.exports = router;