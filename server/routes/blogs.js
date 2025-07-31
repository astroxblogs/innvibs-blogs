// server/routes/blogs.js
const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { adminAuth } = require('../middleware/auth'); // Assuming you use this

// --- CRITICAL ROUTE ORDERING ---

// 1. Define specific GET routes first that don't use an ID as their primary segment.
// Route to get the 5 latest blogs (for carousel)
router.get('/latest', blogController.getLatestBlogs); // <-- THIS MUST COME BEFORE '/:id'

// Route for search functionality
router.get('/search', blogController.searchBlogs);     // <-- THIS ALSO MUST COME BEFORE '/:id'

// 2. Then, define the general GET route for a single blog by ID.
router.get('/:id', blogController.getBlog);           // <-- This catches anything like /blogs/someId

// 3. Then, define the general GET route for all blogs (with optional queries like category/page).
router.get('/', blogController.getBlogs);            // <-- This catches just /blogs


// --- Other HTTP methods (order among themselves less critical, but logically group) ---

// Routes that might require admin authentication
router.post('/', adminAuth, blogController.createBlog); // For creating new blogs
router.put('/:id', adminAuth, blogController.updateBlog); // For updating existing blogs
router.delete('/:id', adminAuth, blogController.deleteBlog); // For deleting blogs

// Comment routes (if not in a separate comments.js)
router.post('/:id/comments', blogController.addComment);
router.delete('/:id/comments/:commentId', adminAuth, blogController.deleteComment); // Assuming comments delete needs auth

// Like route
router.post('/:id/like', blogController.likeBlog);


module.exports = router;