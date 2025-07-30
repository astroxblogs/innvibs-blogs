 

require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const blogRoutes = require('./routes/blogs');
const adminRoutes = require('./routes/admin');
const subscriberRoutes = require('./routes/subscribers');

 
const { adminAuth } = require('./middleware/auth');  
const app = express();

 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
 
app.use(cors({
    origin: process.env.CORS_ORIGIN
}));

 
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

 
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

 
app.post('/api/blogs/upload-image', adminAuth, upload.single('image'), async (req, res) => {
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

// API Routes
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', subscriberRoutes);

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