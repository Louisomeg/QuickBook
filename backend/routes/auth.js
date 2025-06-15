const express = require('express');
const router = express.Router();
const { registerValidator, loginValidator } = require('../middleware/validators');
const { authenticate } = require('../middleware/auth');
const authController = require('../controllers/authController');

// Public routes
router.post('/register', registerValidator, authController.register);
router.post('/login', loginValidator, authController.login);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.post('/change-password', authenticate, authController.changePassword);

module.exports = router;