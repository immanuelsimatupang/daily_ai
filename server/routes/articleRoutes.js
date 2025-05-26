const express = require('express');
const { getArticles, getArticleById, createArticle, updateArticle, deleteArticle } = require('../controllers/articleController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Rute publik
router.get('/', getArticles);
router.get('/:id', getArticleById);

// Rute yang memerlukan autentikasi
router.post('/', protect, createArticle);
router.put('/:id', protect, updateArticle);
router.delete('/:id', protect, deleteArticle);

module.exports = router;