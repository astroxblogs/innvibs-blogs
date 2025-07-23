require('dotenv').config(); // Keep this at the very top

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Ensure cors is imported
const blogRoutes = require('./routes/blogs'); // Ensure routes are imported
const adminRoutes = require('./routes/admin'); // Ensure routes are imported

const app = express();

// CORS Middleware - for local development, allow all origins
// IMPORTANT: When deploying, you'll change this to your frontend's deployed URL
app.use(cors());

// Body parser middleware to handle JSON and URL-encoded data
// Increased limit for larger blog content
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Routes
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes);

// Default route for testing if the API is running
app.get('/', (req, res) => {
    res.send('AstroXHub Backend API is running!');
});

// Database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define the port, using process.env.PORT for Render deployment or 5000 for local
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
