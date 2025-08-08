const express = require('express');
const router = express.Router();
const { subscribe, trackLike, trackComment, trackReadDuration } = require('../controllers/subscriberController');

// Public subscriber routes
router.post('/', subscribe);
router.post('/track/like', trackLike);
router.post('/track/comment', trackComment);
router.post('/track/read', trackReadDuration);

module.exports = router;