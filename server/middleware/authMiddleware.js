const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware untuk melindungi rute
exports.protect = async (req, res, next) => {
  let token;

  // Cek apakah ada token di header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Ambil token dari header
      token = req.headers.authorization.split(' ')[1];

      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Dapatkan user dari token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Pengguna untuk token ini tidak ditemukan'
        });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({
        success: false,
        message: 'Token tidak valid atau telah kedaluwarsa'
      });
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Tidak ada token, akses ditolak'
    });
  }
};

// Middleware untuk membatasi akses berdasarkan role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} tidak diizinkan mengakses rute ini`
      });
    }
    next();
  };
};