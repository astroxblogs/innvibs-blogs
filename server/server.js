// server/server.js

require('dotenv').config(); // Keep this at the very top

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const sharp = require('sharp'); // <-- Import sharp
const fs = require('fs'); // Still good to have, though not directly used for memoryStorage
const path = require('path'); // Still good to have

const blogRoutes = require('./routes/blogs');
const adminRoutes = require('./routes/admin');
// NEW: Import subscriber routes
const subscriberRoutes = require('./routes/subscribers'); // <-- ADD THIS LINE

const app = express();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// CORS Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN
}));

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- Multer Configuration for temporary file storage ---
const storage = multer.memoryStorage(); // Store file in memory as a Buffer
const upload = multer({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // Max file size frontend can send (20MB)
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// --- Image Upload Route (using Multer, Sharp, and Cloudinary) ---
app.post('/api/blogs/upload-image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided.' });
        }

        // --- Image Processing with Sharp ---
        // Resize and convert to WebP (or JPEG/PNG) for optimization
        const processedImageBuffer = await sharp(req.file.buffer)
            .resize({
                width: 1200, // Max width for blog images
                // height: 800, // Optional: specify height, or let it auto-adjust aspect ratio
                fit: sharp.fit.inside, // Ensures image fits within dimensions without cropping
                withoutEnlargement: true // Don't enlarge if original is smaller
            })
            .webp({ quality: 80 }) // Convert to WebP format with 80% quality
            .toBuffer(); // Convert back to buffer

        // Convert the processed image buffer to a base64 string
        const base64Image = processedImageBuffer.toString('base64');
        const dataUri = `data:${req.file.mimetype};base64,${base64Image}`; // Use original mimetype or change to image/webp

        // Upload the processed image buffer to Cloudinary
        const result = await cloudinary.uploader.upload(dataUri, {
            folder: 'astroxhub_blog_images', // Optional: specify a folder in Cloudinary
            // Cloudinary will handle its own transformations, but we've pre-processed for size
        });

        res.status(200).json({ imageUrl: result.secure_url });
    } catch (error) {
        console.error('Image upload processing or Cloudinary error:', error);
        // Provide a more informative error message to the frontend
        res.status(500).json({ error: 'Image upload failed due to processing or Cloudinary issue.', details: error.message });
    }
});

// API Routes
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes);
// NEW: Use subscriber routes
app.use('/api', subscriberRoutes); // <-- ADD THIS LINE

// Default route
app.get('/', (req, res) => {
    res.send('innvibs Backend API is running!');
});

// Database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));