const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    comment: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const BlogSchema = new mongoose.Schema({
    // Multi-language title support
    title: {
        en: { type: String, required: true },
        hi: { type: String, required: true },
        fr: { type: String, required: true },
        es: { type: String, required: true }
    },
    // Multi-language content support (will store rich HTML)
    content: {
        en: { type: String, required: true },
        hi: { type: String, required: true },
        fr: { type: String, required: true },
        es: { type: String, required: true }
    },
    // Featured image for the blog post
    image: { type: String },
    // Renamed 'tags' to 'categories'
    categories: [String],
    date: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    comments: [CommentSchema]
});

module.exports = mongoose.model('Blog', BlogSchema);