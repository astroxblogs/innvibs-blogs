require('dotenv').config();

const express = require('express');

const mongoose = require('mongoose');

const cors = require('cors');



const app = express();



// Middleware

app.use(cors());

// Increase the limit for JSON and URL-encoded payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));



// Connect to MongoDB

mongoose.connect(process.env.MONGO_URI, {

    useNewUrlParser: true,

    useUnifiedTopology: true,

}).then(() => console.log('MongoDB connected'))

    .catch((err) => console.error('MongoDB connection error:', err));



// Routes

app.use('/api/blogs', require('./routes/blogs'));

app.use('/api/admin', require('./routes/admin'));



// Default route

app.get('/', (req, res) => {

    res.send('Blog API running');

});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));