const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    comment: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const BlogSchema = new mongoose.Schema({
     
    title: { 
        type: String,
        required: true
    },
    content: {  
        type: String,
        required: true
    },
    
    title_en: { type: String, required: true },
    title_hi: { type: String },
    title_es: { type: String },
    title_fr: { type: String },

    
    content_en: { type: String, required: true },
    content_hi: { type: String },
    content_es: { type: String },
    content_fr: { type: String },

    image: { type: String },
    date: { type: Date, default: Date.now },
    category: {
        type: String,
        required: true
    },
    tags: [String],
    likes: { type: Number, default: 0 },
    comments: [CommentSchema]
});

module.exports = mongoose.model('Blog', BlogSchema);