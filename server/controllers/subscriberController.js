// server/controllers/subscriberController.js
const Subscriber = require('../models/Subscriber');
const Blog = require('../models/Blog'); // Import the Blog model

// @route   POST /api/subscribe
// @desc    Subscribe a new user to the newsletter
// @access  Public
exports.subscribe = async (req, res) => {
    const { email } = req.body;

    // Basic validation
    if (!email) {
        return res.status(400).json({ msg: 'Email is required.' });
    }

    try {
        // NEW DEBUG LOG: Log the email being searched for
        console.log('Backend DEBUG (Subscribe): Attempting to find subscriber with email:', email.toLowerCase());

        let subscriber = await Subscriber.findOne({ email: email.toLowerCase() }); // Ensure search is lowercase

        // NEW DEBUG LOG: Log what was found
        if (subscriber) {
            console.log('Backend DEBUG (Subscribe): Found existing subscriber:', subscriber.email, 'ID:', subscriber._id);
            return res.status(200).json({ msg: 'You are already subscribed.', subscriberId: subscriber._id });
        } else {
            console.log('Backend DEBUG (Subscribe): No existing subscriber found. Proceeding to create new.');
        }

        subscriber = new Subscriber({ email });
        await subscriber.save();
        console.log('Backend DEBUG (Subscribe): New subscriber saved successfully:', subscriber.email, 'ID:', subscriber._id, '__v:', subscriber.__v); // NEW DEBUG LOG

        res.status(201).json({ msg: 'Subscription successful!', subscriberId: subscriber._id });

    } catch (err) {
        console.error('Backend DEBUG (Subscribe): Error subscribing user:', err.message); // Updated log
        if (err.code === 11000) { // This is for duplicate key error on save
            console.log('Backend DEBUG (Subscribe): Duplicate key error (11000) for email:', email); // NEW DEBUG LOG
            return res.status(409).json({ msg: 'This email is already subscribed.' });
        }
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @route   POST /api/track/like
// @desc    Track a user's like behavior and infer interests
// @access  Public (frontend sends subscriberId from localStorage)
exports.trackLike = async (req, res) => {
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

        const updatedCategories = [
            ...new Set([...subscriber.inferredCategories, ...relevantTerms])
        ];

        subscriber.inferredCategories = updatedCategories;
        await subscriber.save();

        res.status(200).json({ msg: 'Like behavior tracked successfully.', inferredCategories: subscriber.inferredCategories });

    } catch (err) {
        console.error('Error tracking like behavior:', err.message);
        res.status(500).json({ msg: 'Server Error tracking like.' });
    }
};

// @route   POST /api/track/comment
// @desc    Track a user's comment behavior and infer interests
// @access  Public (frontend sends subscriberId from localStorage)
exports.trackComment = async (req, res) => {
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

        const updatedCategories = [
            ...new Set([...subscriber.inferredCategories, ...relevantTerms])
        ];

        subscriber.inferredCategories = updatedCategories;
        await subscriber.save();

        res.status(200).json({ msg: 'Comment behavior tracked successfully.', inferredCategories: subscriber.inferredCategories });

    } catch (err) {
        console.error('Error tracking comment behavior:', err.message);
        res.status(500).json({ msg: 'Server Error tracking comment.' });
    }
};

// @route   POST /api/track/read
// @desc    Track a user's reading behavior and infer interests
// @access  Public (frontend sends subscriberId from localStorage)
exports.trackReadDuration = async (req, res) => {
    const { subscriberId, blogId, duration } = req.body;

    // NEW DEBUG LOGS
    console.log('Backend DEBUG: trackReadDuration received -> subscriberId:', subscriberId, 'blogId:', blogId, 'duration:', duration);

    if (!subscriberId || !blogId) {
        return res.status(400).json({ msg: 'Subscriber ID and Blog ID are required.' });
    }

    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            console.log('Backend DEBUG: Blog not found for ID:', blogId);
            return res.status(404).json({ msg: 'Blog not found.' });
        }
        console.log('Backend DEBUG: Found blog category:', blog.category, 'tags:', blog.tags);

        let relevantTerms = [];
        if (blog.category) {
            relevantTerms.push(blog.category);
        }
        if (blog.tags && Array.isArray(blog.tags)) {
            relevantTerms = [...relevantTerms, ...blog.tags];
        }

        const subscriber = await Subscriber.findById(subscriberId); // Finds by _id
        if (!subscriber) {
            console.log('Backend DEBUG: Subscriber not found for ID:', subscriberId);
            return res.status(404).json({ msg: 'Subscriber not found.' });
        }
        console.log('Backend DEBUG: Found subscriber email:', subscriber.email, 'current inferredCategories:', subscriber.inferredCategories);


        const updatedCategories = [
            ...new Set([...subscriber.inferredCategories, ...relevantTerms])
        ];
        console.log('Backend DEBUG: Calculated updated inferredCategories:', updatedCategories);

        subscriber.inferredCategories = updatedCategories;
        await subscriber.save();
        console.log('Backend DEBUG: Subscriber saved successfully. New __v:', subscriber.__v);

        res.status(200).json({ msg: `Read behavior for duration ${duration || 'N/A'}s tracked successfully.`, inferredCategories: subscriber.inferredCategories });

    } catch (err) {
        console.error('Backend DEBUG: Error tracking read behavior:', err.message);
        res.status(500).json({ msg: 'Server Error tracking read duration.' });
    }
};