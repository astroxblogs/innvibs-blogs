const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { adminAuth } = require('../middleware/auth');


// --- Public Routes ---
// IMPORTANT: Specific routes like '/latest' and '/search' must come before the dynamic '/:id' route.

// NEW: Route to get the 5 latest blogs for the carousel
router.get('/latest', blogController.getLatestBlogs);

// RE-ADDED: Route to handle blog searches (e.g., /blogs/search?q=Technology)
router.get('/search', blogController.searchBlogs);

// Gets all blogs OR filters by category (e.g., /blogs?category=Fashion)
router.get('/', blogController.getBlogs);

// Gets a single blog by its ID. This must be last among the GET routes.
router.get('/:id', blogController.getBlog);

router.post('/:id/comments', blogController.addComment);
router.post('/:id/like', blogController.likeBlog);


// --- Admin Routes (Protected) ---
router.post('/', adminAuth, blogController.createBlog);
router.put('/:id', adminAuth, blogController.updateBlog);
router.delete('/:id', adminAuth, blogController.deleteBlog);
router.delete('/:id/comments/:commentId', adminAuth, blogController.deleteComment);


module.exports = router;