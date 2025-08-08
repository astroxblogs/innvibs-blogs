const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Import the admin routes
const adminRoutes = require('./routes/admin');
const blogController = require('./controllers/blogController'); // Required for image upload

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: [process.env.CLIENT_ADMIN_URL_DEV, process.env.CLIENT_ADMIN_URL_PROD],
    credentials: true,
}));

// Multer storage configuration for image upload
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});


// API Routes
app.use('/api/admin', adminRoutes);

 
app.post('/api/admin/blogs/upload-image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided.' });
        }

        const processedImageBuffer = await sharp(req.file.buffer)
            .resize({
                width: 1200,
                fit: sharp.fit.inside,
                withoutEnlargement: true
            })
            .webp({ quality: 80 })
            .toBuffer();

        const base64Image = processedImageBuffer.toString('base64');
        const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;

        const result = await cloudinary.uploader.upload(dataUri, {
            folder: 'astroxhub_blog_images',
        });

        res.status(200).json({ imageUrl: result.secure_url });
    } catch (error) {
        console.error('Image upload processing or Cloudinary error:', error);
        res.status(500).json({ error: 'Image upload failed due to processing or Cloudinary issue.', details: error.message });
    }
});
// --- END NEW ROUTE ---

// Simple health check route
app.get('/', (req, res) => {
    res.send('Admin Backend is running!');
});

const PORT = process.env.ADMIN_SERVER_PORT || 5001;
app.listen(PORT, () => {
    console.log(`Admin backend server is running on port ${PORT}`);
});
mongoose.connect(process.env.MONGODB_URI, { // <-- CORRECTED: Use MONGODB_URI
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Admin backend connected to MongoDB'))
    .catch(err => {
        console.error('Admin backend MongoDB connection error:', err);
    });