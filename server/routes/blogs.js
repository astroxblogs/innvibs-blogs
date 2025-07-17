const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { adminAuth } = require('../middleware/auth');

// --- New code for handling file uploads ---
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the full path for the uploads directory
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');

// Ensure the upload directory exists. If not, create it.
// The { recursive: true } option ensures that parent directories are also created.
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure the storage engine for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Tell Multer to save files into the 'public/uploads' directory
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Create a unique filename to prevent name collisions
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Initialize Multer with the configured storage
const upload = multer({ storage: storage });
// --- End of new code for file uploads ---


// === Public Routes ===
router.get('/', blogController.getBlogs);
router.get('/:id', blogController.getBlog);
router.post('/:id/comments', blogController.addComment);
router.post('/:id/like', blogController.likeBlog);


// === Admin Routes ===
router.post('/', adminAuth, blogController.createBlog);
router.put('/:id', adminAuth, blogController.updateBlog);
router.delete('/:id', adminAuth, blogController.deleteBlog);
router.delete('/:id/comments/:commentId', adminAuth, blogController.deleteComment);

// --- New Admin route for image uploads ---
// This endpoint will receive files from the rich text editor.
// 'upload.array('images', 10)' means it will process up to 10 files from a form field named 'images'.
router.post('/upload-images', adminAuth, upload.array('images', 10), (req, res) => {
    // Check if files were actually uploaded
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files were uploaded.' });
    }

    // Map the array of file objects to an array of public-facing URLs
    const fileUrls = req.files.map(file => `/uploads/${file.filename}`);

    // Send the URLs back to the client in a JSON response
    res.status(200).json({ urls: fileUrls });
});


module.exports = router;