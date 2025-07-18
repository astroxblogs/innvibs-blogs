const Blog = require('../models/Blog');



exports.getBlogs = async (req, res) => {

    try {

        const lang = req.query.lang;

        const filter = lang ? { language: lang } : {};

        const blogs = await Blog.find(filter).sort({ date: -1 });

        res.json(blogs);

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

};



exports.getBlog = async (req, res) => {

    try {

        const blog = await Blog.findById(req.params.id);

        if (!blog) return res.status(404).json({ error: 'Blog not found' });

        res.json(blog);

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

};



exports.createBlog = async (req, res) => {

    try {

        console.log('Creating blog:', req.body);

        const blog = new Blog(req.body);

        await blog.save();

        console.log('Blog created:', blog);

        res.status(201).json(blog);

    } catch (err) {

        console.error('Error creating blog:', err);

        res.status(400).json({ error: err.message });

    }

};



exports.updateBlog = async (req, res) => {

    try {

        console.log('Updating blog:', req.params.id, req.body);

        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!blog) return res.status(404).json({ error: 'Blog not found' });

        console.log('Blog updated:', blog);

        res.json(blog);

    } catch (err) {

        console.error('Error updating blog:', err);

        res.status(400).json({ error: err.message });

    }

};



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

        blog.comments.id(req.params.commentId).remove();

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