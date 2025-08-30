const Blog = require('../models/Blog');

// Helper function to generate slug from title
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .trim('-'); // Remove leading/trailing hyphens
};

// Function to generate unique slug
const generateUniqueSlug = async (title, existingId = null) => {
    let baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const query = { slug };
        if (existingId) {
            query._id = { $ne: existingId };
        }
        
        const existing = await Blog.findOne(query);
        if (!existing) {
            return slug;
        }
        
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
};

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

 
exports.getBlogs = async (req, res) => {
    try {
    
        const { category, tag, page = 1, limit = 10 } = req.query;
        const parsedLimit = parseInt(limit, 10);
        const parsedPage = parseInt(page, 10);

        if (isNaN(parsedLimit) || parsedLimit <= 0) {
            return res.status(400).json({ error: 'Invalid limit parameter. Must be a positive number.' });
        }
        if (isNaN(parsedPage) || parsedPage <= 0) {
            return res.status(400).json({ error: 'Invalid page parameter. Must be a positive number.' });
        }

  
        let filter = {};

     
        if (category) {
            filter.category = category.trim();
        }

        if (tag) {
            filter.tags = { $in: [new RegExp(`^${tag.trim()}$`, 'i')] };
        }
        const skip = (parsedPage - 1) * parsedLimit;
 
        const blogs = await Blog.find(filter) // <--- ADDED 'const blogs = await' HERE
            .sort({ date: -1 })
            .skip(skip)
            .limit(parsedLimit);
 
        const totalBlogs = await Blog.countDocuments(filter);
        const totalPages = Math.ceil(totalBlogs / parsedLimit);

        res.json({
            blogs,
            currentPage: parsedPage,
            totalPages,
            totalBlogs
        });
    } catch (err) {
        console.error("Error in getBlogs:", err);
        res.status(500).json({ error: err.message || 'Failed to retrieve blogs.' });
    }
};

 
exports.searchBlogs = async (req, res) => {
    const { q, page = 1, limit = 10 } = req.query;
    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(page, 10);

    if (isNaN(parsedLimit) || parsedLimit <= 0) {
        return res.status(400).json({ error: 'Invalid limit parameter. Must be a positive number.' });
    }
    if (isNaN(parsedPage) || parsedPage <= 0) {
        return res.status(400).json({ error: 'Invalid page parameter. Must be a positive number.' });
    }

    if (!q) {
        return res.status(400).json({ error: 'A search query "q" is required.' });
    }

    try {
        const regex = new RegExp(q, 'i');
        const searchFilter = {
            $or: [
                { title: regex },
                { content: regex },
                { title_en: regex },
                { title_hi: regex },


                { content_en: regex },
                { content_hi: regex },


                { tags: regex }, // This will search for the tag within the array
                { category: regex }
            ]
        };
        const skip = (parsedPage - 1) * parsedLimit;

        // Fetch blogs for the current page matching the search filter
        const blogs = await Blog.find(searchFilter)
            .sort({ date: -1 })
            .skip(skip)
            .limit(parsedLimit);

        // Get total count of blogs matching the search filter
        const totalBlogs = await Blog.countDocuments(searchFilter);
        const totalPages = Math.ceil(totalBlogs / parsedLimit);

        res.json({
            blogs,
            currentPage: parsedPage,
            totalPages,
            totalBlogs
        });

    } catch (err) {
        console.error("Error in searchBlogs:", err); // Log the actual error for debugging
        res.status(500).json({ error: 'Failed to perform search.' });
    }
};

// --- UNCHANGED FUNCTIONS ---

// Get a single blog by ID
exports.getBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id); // This correctly fetches one blog
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        res.json(blog); // <--- This should send ONLY the blog object
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new blog (will automatically handle the 'category' from req.body and new language fields)
exports.createBlog = async (req, res) => {
    try {
        const title = req.body.title_en || req.body.title;
        
        if (!title) {
            return res.status(400).json({ error: 'Title is required to generate slug' });
        }
        
        const slug = await generateUniqueSlug(title);
        const blogData = { ...req.body, slug };
        
        const blog = new Blog(blogData);
        await blog.save();
        res.status(201).json(blog);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update an existing blog (will automatically handle new language fields in req.body)
exports.updateBlog = async (req, res) => {
    try {
        const title = req.body.title_en || req.body.title;
        if (title) {
            const slug = await generateUniqueSlug(title, req.params.id);
            req.body.slug = slug;
        }
        
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