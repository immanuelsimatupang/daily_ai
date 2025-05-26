const express = require('express');
const {
  getAllUsers,
  setUserRole,
  setUserActiveStatus,
  deleteUserById
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Semua rute di bawah ini memerlukan autentikasi dan role admin
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getAllUsers);

router.route('/:userId/role')
  .put(setUserRole);

router.route('/:userId/status')
  .put(setUserActiveStatus);

router.route('/:userId')
  .delete(deleteUserById);

module.exports = router;
