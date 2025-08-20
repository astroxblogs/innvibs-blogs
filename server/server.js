require('dotenv').config();


console.log('CORS_ORIGIN_DEV:', process.env.CORS_ORIGIN_DEV);
console.log('CORS_ORIGIN_PROD:', process.env.CORS_ORIGIN_PROD);
console.log('CORS_ORIGIN_Main:', process.env.CORS_ORIGIN_Main);


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const blogRoutes = require('./routes/blogs');
const subscriberRoutes = require('./routes/subscribers');

const { startEmailJob } = require('./jobs/sendPersonalizedEmails');
const app = express();



const allowedOrigins = [
    process.env.CORS_ORIGIN_DEV,
    process.env.CORS_ORIGIN_PROD,
    process.env.CORS_ORIGIN_Main
];


if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.push(process.env.CORS_ORIGIN_DEV);
}

app.use(cors({
    origin: function (origin, callback) {

        if (!origin) return callback(null, true);


        const isAllowed = allowedOrigins.includes(origin);

        if (isAllowed) {
            callback(null, true);
        } else {
            const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
            callback(new Error(msg), false);
        }
    },
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