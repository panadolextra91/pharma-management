const express = require('express');
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware'); // JWT authentication middleware
const authorize = require('../middleware/authorizeMiddleware'); // Role-based authorization middleware
const router = express.Router();
//userRoutes.js
// Define routes
router.get('/', authenticateToken, authorize('admin'), userController.getAllUsers); // Only admin can access
router.post('/', authenticateToken, authorize('admin'), userController.createUser); // Only admin can create users
router.post('/login', userController.loginUser); // Public route for login
router.get('/profile', authenticateToken, authorize('admin', 'pharmacist'), userController.getUserProfile); // Get user profile
router.put('/profile', authenticateToken, authorize('admin', 'pharmacist'), userController.updateUserProfile); // Update user profile
router.put('/change-password', authenticateToken, authorize('admin', 'pharmacist'), userController.changePassword); // Change password
module.exports = router;
