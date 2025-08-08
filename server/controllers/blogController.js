const Blog = require('../models/Blog');

// Get all blogs for the homepage, with pagination and filtering
const getBlogs = async (req, res) => {
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
        if (category && category.toLowerCase() !== 'all') {
            filter.category = category.trim();
        }
        if (tag) {
            filter.tags = { $in: [new RegExp(`^${tag.trim()}$`, 'i')] };
        }

        const skip = (parsedPage - 1) * parsedLimit;
        const blogs = await Blog.find(filter)
            .sort({ date: -1 })
            .skip(skip)
            .limit(parsedLimit);

        const totalBlogs = await Blog.countDocuments(filter);
        const totalPages = Math.ceil(totalBlogs / parsedLimit);

        res.json({ blogs, currentPage: parsedPage, totalPages, totalBlogs });
    } catch (err) {
        console.error("Error in getBlogs:", err);
        res.status(500).json({ error: err.message || 'Failed to retrieve blogs.' });
    }
};

// Get the 5 latest blogs (for carousel)
const getLatestBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ date: -1 }).limit(5);
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Search blogs
const searchBlogs = async (req, res) => {
    const { q, page = 1, limit = 10 } = req.query;
    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(page, 10);

    if (isNaN(parsedLimit) || parsedLimit <= 0 || isNaN(parsedPage) || parsedPage <= 0 || !q) {
        return res.status(400).json({ error: 'Invalid parameters or missing search query.' });
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
                { tags: regex },
                { category: regex }
            ]
        };
        const skip = (parsedPage - 1) * parsedLimit;

        const blogs = await Blog.find(searchFilter)
            .sort({ date: -1 })
            .skip(skip)
            .limit(parsedLimit);

        const totalBlogs = await Blog.countDocuments(searchFilter);
        const totalPages = Math.ceil(totalBlogs / parsedLimit);

        res.json({ blogs, currentPage: parsedPage, totalPages, totalBlogs });
    } catch (err) {
        console.error("Error in searchBlogs:", err);
        res.status(500).json({ error: 'Failed to perform search.' });
    }
};

// Get a single blog by ID
const getBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Export all the remaining functions
module.exports = {
    getBlogs,
    getLatestBlogs,
    searchBlogs,
    getBlog,
};