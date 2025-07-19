const Blog = require('../models/Blog');

// NEW: Get the 5 latest blogs for the homepage carousel
exports.getLatestBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({})
            .sort({ date: -1 }) // Sort by date descending to get the newest first
            .limit(5);          // Limit the results to 5
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATED: Gets all blogs, OR filters by category if a 'category' query param is provided
exports.getBlogs = async (req, res) => {
    try {
        const { category } = req.query; // Check for a category query parameter
        const filter = category ? { category: category.trim() } : {}; // If category exists, create a filter for it

        const blogs = await Blog.find(filter).sort({ date: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATED: Simplified search functionality without translation
exports.searchBlogs = async (req, res) => {
    const { q } = req.query; // Get search query 'q'

    if (!q) {
        return res.status(400).json({ error: 'A search query "q" is required.' });
    }

    try {
        const regex = new RegExp(q, 'i'); // Create a case-insensitive regular expression

        // Search against title, content, tags, and the new category field
        const blogs = await Blog.find({
            $or: [
                { title: regex },
                { content: regex },
                { tags: regex },
                { category: regex }
            ]
        }).sort({ date: -1 });

        res.json(blogs);

    } catch (err) {
        res.status(500).json({ error: 'Failed to perform search.' });
    }
};

// --- UNCHANGED FUNCTIONS ---

// Get a single blog by ID
exports.getBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new blog (will automatically handle the 'category' from req.body)
exports.createBlog = async (req, res) => {
    try {
        const blog = new Blog(req.body);
        await blog.save();
        res.status(201).json(blog);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update an existing blog
exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        res.json(blog);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        res.json({ message: 'Blog deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a comment to a blog
exports.addComment = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        const comment = { name: req.body.name, comment: req.body.comment };
        blog.comments.push(comment);
        await blog.save();
        res.status(201).json(blog.comments[blog.comments.length - 1]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a comment from a blog
exports.deleteComment = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        blog.comments.id(req.params.commentId).remove();
        await blog.save();
        res.json({ message: 'Comment deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Like a blog
exports.likeBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            { $inc: { likes: 1 } },
            { new: true }
        );
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        res.json({ likes: blog.likes });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};