const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    comment: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Corrected typo: 'itle' to 'title'
    content: { type: String, required: true },
    image: { type: String },
    date: { type: Date, default: Date.now },
    // Added the new category field
    category: {
        type: String,
        required: true
    },
    tags: [String],
    // Removed the language field as it's being replaced by category
    likes: { type: Number, default: 0 },
    comments: [CommentSchema]
});

module.exports = mongoose.model('Blog', BlogSchema);