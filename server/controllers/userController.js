const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mendapatkan daftar pengguna',
      error: error.message,
    });
  }
};

// @desc    Delete user by ID
// @route   DELETE /api/users/:userId
// @access  Private/Admin
exports.deleteUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan' });
    }

    // Optional: Prevent admin from deleting themselves, or other safety checks
    // if (req.user.id === user._id.toString()) {
    //   return res.status(400).json({ success: false, message: 'Anda tidak dapat menghapus akun Anda sendiri.' });
    // }

    await user.deleteOne(); // Or User.findByIdAndDelete(req.params.userId);

    res.status(200).json({ success: true, message: 'Pengguna berhasil dihapus' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus pengguna',
      error: error.message,
    });
  }
};

// @desc    Update user role
// @route   PUT /api/users/:userId/role
// @access  Private/Admin
exports.setUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { userId } = req.params;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role tidak valid' });
    }

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true, runValidators: true });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan' });
    }

    res.status(200).json({ success: true, message: 'Role pengguna berhasil diperbarui', user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui role pengguna',
      error: error.message,
    });
  }
};

// @desc    Update user active status
// @route   PUT /api/users/:userId/status
// @access  Private/Admin
exports.setUserActiveStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const { userId } = req.params;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'Status isActive tidak valid' });
    }

    const user = await User.findByIdAndUpdate(userId, { isActive }, { new: true, runValidators: true });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan' });
    }

    res.status(200).json({ success: true, message: 'Status pengguna berhasil diperbarui', user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui status pengguna',
      error: error.message,
    });
  }
};
