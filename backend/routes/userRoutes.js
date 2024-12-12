const express = require('express');
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizeMiddleware'); // Role-based authorization middleware
const router = express.Router();
//userRoutes.js
// Define routes
router.get('/', authenticateToken, authorize('admin'), userController.getAllUsers);
router.post('/', authenticateToken, authorize('admin'), userController.createUser);
router.post('/login', userController.loginUser); // Public route for login
router.get('/profile', authenticateToken, authorize('admin', 'pharmacist'), userController.getUserProfile); // Get user profile
router.put('/profile', authenticateToken, authorize('admin', 'pharmacist'), userController.updateUserProfile); // Update user profile
router.put('/change-password', authenticateToken, authorize('admin', 'pharmacist'), userController.changePassword); // Change password
router.post('/forgot-password', userController.forgotPassword);
module.exports = router;
