const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth'); // Import the auth middleware
const blogController = require('../controllers/blogController'); // Assuming blog management routes might be here or linked

// Admin Login Route (No authentication needed here, as this is how admin gets token)
router.post('/login', adminController.login);
 
 
router.post('/blogs', adminAuth, blogController.createBlog);      // Example: Create a new blog (requires admin)
router.put('/blogs/:id', adminAuth, blogController.updateBlog);   // Example: Update a blog (requires admin)
router.delete('/blogs/:id', adminAuth, blogController.deleteBlog); // Example: Delete a blog (requires admin)
router.get('/blogs', adminAuth, blogController.getAllBlogsAdmin); // Example: Get all blogs for admin table


module.exports = router;