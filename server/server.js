const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');
const userRoutes = require('./routes/userRoutes');
const curatedNewsRoutes = require('./routes/curatedNewsRoutes');
const { scheduleNewsFetching } = require('./services/newsScheduler'); // Import scheduler

// Konfigurasi environment variables
dotenv.config();

// Inisialisasi aplikasi Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Terhubung ke MongoDB');
    // Initialize news fetching scheduler AFTER successful DB connection
    scheduleNewsFetching(); 
  })
  .catch(err => console.error('Gagal terhubung ke MongoDB:', err));

// Route dasar
app.get('/', (req, res) => {
  res.json({ message: 'Selamat datang di API AIWave' });
});

// Gunakan routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/curated-news', curatedNewsRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error stack for debugging

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan pada server';

  res.status(statusCode).json({
    success: false,
    message: message,
    // Optional: you might want to conditionally add the stack in development
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// Definisikan port
const PORT = process.env.PORT || 5000;

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});