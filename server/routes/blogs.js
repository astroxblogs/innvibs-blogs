// main-blog-site/server/routes/blogs.js
const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const categoryController = require('../controllers/categoryController'); // <-- NEW IMPORT

 
router.get('/', blogController.getBlogs);

 
router.get('/categories', categoryController.getCategories);

// Existing routes
router.get('/search', blogController.searchBlogs);
router.get('/latest', blogController.getLatestBlogs);
router.get('/:id', blogController.getBlog);

module.exports = router;