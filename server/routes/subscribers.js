// server/routes/subscribers.js
const express = require('express');
const router = express.Router();
const subscriberController = require('../controllers/subscriberController');

// @route   POST /api/subscribe
// @desc    Subscribe a new user to the newsletter
// @access  Public
router.post('/subscribe', subscriberController.subscribe);

// NEW: Route for tracking user likes
// @route   POST /api/track/like
// @desc    Track a user's like behavior and infer interests
// @access  Public
router.post('/track/like', subscriberController.trackLike);  
router.post('/track/comment', subscriberController.trackComment);
router.post('/track/read', subscriberController.trackReadDuration);


// In later phases, we'll add more routes here for tracking behavior:
// router.post('/track/comment', subscriberController.trackComment);
// router.post('/track/read', subscriberController.trackReadDuration);

module.exports = router;