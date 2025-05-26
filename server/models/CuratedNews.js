const mongoose = require('mongoose');
const mongoosePaginateV2 = require('mongoose-paginate-v2');

const CuratedNewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Judul berita harus diisi'],
    trim: true,
  },
  originalUrl: {
    type: String,
    required: [true, 'URL asli berita harus diisi'],
    unique: true,
    trim: true,
  },
  sourceName: {
    type: String,
    required: [true, 'Nama sumber berita harus diisi'],
    trim: true,
  },
  publishedAt: {
    type: Date,
    required: [true, 'Tanggal publikasi harus diisi'],
  },
  description: {
    type: String,
    trim: true,
  },
  content: { // Full content, might be truncated by API
    type: String,
    trim: true,
  },
  aiSummary: { // AI-generated summary
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Kategori berita harus diisi'],
    enum: ['New AI Tools/Products', 'AI Model Updates', 'AI Companies', 'AI Research', 'AI Ethics & Governance', 'AI Applications'],
  },
  keywordsUsed: { // Keywords used in the query that fetched this article
    type: [String],
  },
  tags: { // Initially can be empty or derived from keywordsUsed
    type: [String],
    default: [],
  },
  fetchedAt: {
    type: Date,
    default: Date.now,
  },
  processedByAI: { // Flag to indicate if further AI processing was done
    type: Boolean,
    default: false,
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

CuratedNewsSchema.plugin(mongoosePaginateV2);

module.exports = mongoose.model('CuratedNews', CuratedNewsSchema);
