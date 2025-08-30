// astroxblogs-innvibs-blogs/server/controllers/subscriberController.js
const Subscriber = require('../models/Subscriber');
const Blog = require('../models/Blog'); // Import the Blog model

console.log('Subscriber model loaded:', !!Subscriber);
console.log('Blog model loaded:', !!Blog);

// @route   POST /api/subscribe
// @desc    Subscribe a new user to the newsletter
// @access  Public
const subscribe = async (req, res) => {
    const { email } = req.body;

    console.log('Subscription request received for email:', email);

    if (!email) {
        return res.status(400).json({ msg: 'Email is required.' });
    }

    try {
        let subscriber = await Subscriber.findOne({ email: email.toLowerCase() });

        if (subscriber) {
            console.log('Subscriber already exists:', subscriber._id);
            return res.status(200).json({ msg: 'You are already subscribed.', subscriberId: subscriber._id });
        }

        console.log('Creating new subscriber for email:', email);
        subscriber = new Subscriber({ email });
        await subscriber.save();

        console.log('Subscriber created successfully:', subscriber._id);
        res.status(201).json({ msg: 'Subscription successful!', subscriberId: subscriber._id });

    } catch (err) {
        console.error('Subscription error:', err);
        if (err.code === 11000) {
            return res.status(409).json({ msg: 'This email is already subscribed.' });
        }
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

 
  const trackLike = async (req, res) => {
    const { subscriberId, blogId } = req.body;

    if (!subscriberId || !blogId) {
        return res.status(400).json({ msg: 'Subscriber ID and Blog ID are required.' });
    }

    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ msg: 'Blog not found.' });
        }

        let relevantTerms = [];
        if (blog.category) {
            relevantTerms.push(blog.category);
        }
        if (blog.tags && Array.isArray(blog.tags)) {
            relevantTerms = [...relevantTerms, ...blog.tags];
        }

        const subscriber = await Subscriber.findById(subscriberId);
        if (!subscriber) {
            return res.status(404).json({ msg: 'Subscriber not found.' });
        }

        const currentCategories = subscriber.inferredCategories || [];
        const updatedCategories = [
            ...new Set([...currentCategories, ...relevantTerms])
        ];

        subscriber.inferredCategories = updatedCategories;
        await subscriber.save();

        res.status(200).json({ msg: 'Like behavior tracked successfully.', inferredCategories: subscriber.inferredCategories });

    } catch (err) {
        res.status(500).json({ msg: 'Server Error tracking like.' });
    }
};

 
const trackComment = async (req, res) => {
    const { subscriberId, blogId } = req.body;

    if (!subscriberId || !blogId) {
        return res.status(400).json({ msg: 'Subscriber ID and Blog ID are required.' });
    }

    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ msg: 'Blog not found.' });
        }

        let relevantTerms = [];
        if (blog.category) {
            relevantTerms.push(blog.category);
        }
        if (blog.tags && Array.isArray(blog.tags)) {
            relevantTerms = [...relevantTerms, ...blog.tags];
        }

        const subscriber = await Subscriber.findById(subscriberId);
        if (!subscriber) {
            return res.status(404).json({ msg: 'Subscriber not found.' });
        }

        const currentCategories = subscriber.inferredCategories || [];
        const updatedCategories = [
            ...new Set([...currentCategories, ...relevantTerms])
        ];

        subscriber.inferredCategories = updatedCategories;
        await subscriber.save();

        res.status(200).json({ msg: 'Comment behavior tracked successfully.', inferredCategories: subscriber.inferredCategories });

    } catch (err) {
        res.status(500).json({ msg: 'Server Error tracking comment.' });
    }
};

 
const trackReadDuration = async (req, res) => {
    const { subscriberId, blogId, duration } = req.body;

    if (!subscriberId || !blogId) {
        return res.status(400).json({ msg: 'Subscriber ID and Blog ID are required.' });
    }

    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ msg: 'Blog not found.' });
        }

        let relevantTerms = [];
        if (blog.category) {
            relevantTerms.push(blog.category);
        }
        if (blog.tags && Array.isArray(blog.tags)) {
            relevantTerms = [...relevantTerms, ...blog.tags];
        }

        const subscriber = await Subscriber.findById(subscriberId);
        if (!subscriber) {
            return res.status(404).json({ msg: 'Subscriber not found.' });
        }

        const currentCategories = subscriber.inferredCategories || [];
        const updatedCategories = [
            ...new Set([...currentCategories, ...relevantTerms])
        ];

        subscriber.inferredCategories = updatedCategories;
        await subscriber.save();

        res.status(200).json({ msg: `Read behavior for duration ${duration || 'N/A'}s tracked successfully.`, inferredCategories: subscriber.inferredCategories });

    } catch (err) {
        res.status(500).json({ msg: 'Server Error tracking read duration.' });
    }
};
 
module.exports = {
    subscribe,
    trackLike,
    trackComment,
    trackReadDuration
};