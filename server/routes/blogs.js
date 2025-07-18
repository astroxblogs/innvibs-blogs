const express = require('express');



const router = express.Router();



const blogController = require('../controllers/blogController');



const { adminAuth } = require('../middleware/auth');







// Public



router.get('/', blogController.getBlogs);



router.get('/:id', blogController.getBlog);



router.post('/:id/comments', blogController.addComment);



router.post('/:id/like', blogController.likeBlog);







// Admin



router.post('/', adminAuth, blogController.createBlog);



router.put('/:id', adminAuth, blogController.updateBlog);



router.delete('/:id', adminAuth, blogController.deleteBlog);



router.delete('/:id/comments/:commentId', adminAuth, blogController.deleteComment);







module.exports = router;