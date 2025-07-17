const mongoose = require('mongoose');

// This schema remains unchanged
const CommentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    comment: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const BlogSchema = new mongoose.Schema({
    // --- New multilingual structure for title ---
    // Instead of a single string, it's an object with language keys.
    title: {
        en: { type: String, required: true },
        es: { type: String },
        fr: { type: String },
        hi: { type: String }
    },

    // --- New multilingual structure for content ---
    // This will store the HTML from the rich text editor for each language.
    content: {
        en: { type: String, required: true },
        es: { type: String },
        fr: { type: String },
        hi: { type: String }
    },

    // --- Replaced single 'image' with an array for multiple image URLs ---
    images: [{ type: String }],

    // --- The old 'language' and 'image' fields are no longer needed ---

    // --- Existing fields that are kept ---
    date: { type: Date, default: Date.now },
    tags: [String],
    likes: { type: Number, default: 0 },
    comments: [CommentSchema]
}, {
    // Best practice: adds createdAt and updatedAt timestamps automatically
    timestamps: true
});

module.exports = mongoose.model('Blog', BlogSchema);