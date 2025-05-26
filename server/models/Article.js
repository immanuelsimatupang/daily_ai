const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Judul artikel harus diisi'],
    trim: true,
    maxlength: [100, 'Judul tidak boleh lebih dari 100 karakter']
  },
  content: {
    type: String,
    required: [true, 'Konten artikel harus diisi']
  },
  summary: {
    type: String,
    required: [true, 'Ringkasan artikel harus diisi'],
    maxlength: [200, 'Ringkasan tidak boleh lebih dari 200 karakter']
  },
  category: {
    type: String,
    required: [true, 'Kategori harus diisi'],
    enum: ['teknologi', 'kesehatan', 'pendidikan', 'bisnis', 'hiburan', 'lainnya']
  },
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String,
    default: 'default-article.jpg'
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware untuk mengupdate tanggal saat artikel diperbarui
ArticleSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  next();
});

// Method untuk meningkatkan jumlah view
ArticleSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

module.exports = mongoose.model('Article', ArticleSchema);