const Article = require('../models/Article');

// @desc    Mendapatkan semua artikel
// @route   GET /api/articles
// @access  Public
exports.getArticles = async (req, res) => {
  try {
    const { category, tag, limit = 10, page = 1 } = req.query;
    const query = {};
    
    // Filter berdasarkan kategori jika ada
    if (category) {
      query.category = category;
    }
    
    // Filter berdasarkan tag jika ada
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    // Hanya tampilkan artikel yang dipublish
    query.isPublished = true;
    
    // Hitung total artikel
    const total = await Article.countDocuments(query);
    
    // Pagination
    const skip = (page - 1) * limit;
    
    // Dapatkan artikel dengan pagination
    const articles = await Article.find(query)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    res.status(200).json({
      success: true,
      count: articles.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      articles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mendapatkan artikel',
      error: error.message
    });
  }
};

// @desc    Mendapatkan artikel berdasarkan ID
// @route   GET /api/articles/:id
// @access  Public
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'name');
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan'
      });
    }
    
    // Tambah view count
    await article.incrementViewCount();
    
    res.status(200).json({
      success: true,
      article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mendapatkan artikel',
      error: error.message
    });
  }
};

// @desc    Membuat artikel baru
// @route   POST /api/articles
// @access  Private
exports.createArticle = async (req, res) => {
  try {
    // Tambahkan user ID sebagai author
    req.body.author = req.user.id;
    
    const article = await Article.create(req.body);
    
    res.status(201).json({
      success: true,
      article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal membuat artikel',
      error: error.message
    });
  }
};

// @desc    Update artikel
// @route   PUT /api/articles/:id
// @access  Private
exports.updateArticle = async (req, res) => {
  try {
    let article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan'
      });
    }
    
    // Pastikan user adalah pemilik artikel atau admin
    if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Tidak diizinkan mengubah artikel ini'
      });
    }
    
    article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate artikel',
      error: error.message
    });
  }
};

// @desc    Hapus artikel
// @route   DELETE /api/articles/:id
// @access  Private
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan'
      });
    }
    
    // Pastikan user adalah pemilik artikel atau admin
    if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Tidak diizinkan menghapus artikel ini'
      });
    }
    
    await article.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Artikel berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus artikel',
      error: error.message
    });
  }
};