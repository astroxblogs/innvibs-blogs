 

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

 
const blogRoutes = require('./routes/blogs');
const subscriberRoutes = require('./routes/subscribers');

const { startEmailJob } = require('./jobs/sendPersonalizedEmails');
const app = express();

 
app.use(cors({
    origin: [
        process.env.CORS_ORIGIN_DEV,
        process.env.CORS_ORIGIN_PROD
    ],
    credentials: true
}));
 


 
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


 
app.use('/api/blogs', blogRoutes);
app.use('/api/subscribers', subscriberRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('innvibs Backend API is running!');
});

// Database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
        startEmailJob();
    })
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));