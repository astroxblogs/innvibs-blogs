require('dotenv').config(); // Keep this at the very top

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Ensure cors is imported
const blogRoutes = require('./routes/blogs'); // Ensure routes are imported
const adminRoutes = require('./routes/admin'); // Ensure routes are imported

const app = express();


app.use(cors({
    origin: 'https://www.innvibs.com' 
}))

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Routes
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes);


app.get('/', (req, res) => {
    res.send('AstroXHub Backend API is running!');
});

// Database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
