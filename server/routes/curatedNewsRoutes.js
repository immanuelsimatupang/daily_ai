const express = require('express');
const {
  fetchAndStoreNews,
  getCuratedNews
} = require('../controllers/curatedNewsController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route to get curated news
router.route('/')
  .get(getCuratedNews);

// Protected admin route to trigger news fetching
router.route('/fetch')
  .post(protect, authorize('admin'), fetchAndStoreNews);

module.exports = router;
