const Blog = require('../models/Blog');

// GET all blogs, but transform the data to return only the requested language
exports.getBlogs = async (req, res) => {
    try {
        // Default to English ('en') if no language query is provided
        const lang = req.query.lang || 'en';

        // Use an aggregation pipeline to reshape the data
        const blogs = await Blog.aggregate([
            {
                $project: {
                    _id: 1,
                    image: 1,
                    categories: 1,
                    date: 1,
                    likes: 1,
                    commentCount: { $size: "$comments" },
                    // Dynamically select the title and content based on the 'lang' query param
                    title: `$title.${lang}`,
                    // Create a short snippet of the content for the blog list view
                    content: { $substr: [`$content.${lang}`, 0, 150] }
                }
            },
            {
                $sort: { date: -1 }
            }
        ]);

        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET blogs by a specific category
exports.getBlogsByCategory = async (req, res) => {
    try {
        const { categoryName } = req.params;
        const lang = req.query.lang || 'en';

        const blogs = await Blog.aggregate([
            // 1. Find blogs that include the specified category
            {
                $match: { categories: categoryName }
            },
            // 2. Reshape the data to be language-specific
            {
                $project: {
                    _id: 1,
                    image: 1,
                    categories: 1,
                    date: 1,
                    likes: 1,
                    commentCount: { $size: "$comments" },
                    title: `$title.${lang}`,
                    content: { $substr: [`$content.${lang}`, 0, 150] }
                }
            },
            {
                $sort: { date: -1 }
            }
        ]);

        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// GET a single blog by its ID. Returns all language content.
exports.getBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        // No changes needed. Returning the full document is ideal for the detail page
        // as it allows the user to switch languages on the frontend.
        res.json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CREATE a new blog post.
exports.createBlog = async (req, res) => {
    try {
        // No changes needed. The incoming req.body will have the new nested object structure,
        // and Mongoose will map it correctly to the new schema.
        // The body should include `{ title: { en: '..', hi: '..', ... }, content: { ... }, categories: [...] }`
        const blog = new Blog(req.body);
        await blog.save();
        res.status(201).json(blog);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// UPDATE an existing blog post.
exports.updateBlog = async (req, res) => {
    try {
        // No changes needed. The update payload in req.body will correctly
        // update the nested language fields and categories.
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        res.json(blog);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


// The following functions do not need changes as they operate on fields
// or sub-documents that were not affected by the schema update.

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        res.json({ message: 'Blog deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

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

exports.deleteComment = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        // Mongoose's .id() method correctly finds the sub-document to remove.
        const comment = blog.comments.id(req.params.commentId);
        if (comment) {
            comment.remove();
        }
        await blog.save();
        res.json({ message: 'Comment deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


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