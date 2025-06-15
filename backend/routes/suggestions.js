const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticate } = require('../middleware/auth');
const suggestionsController = require('../controllers/suggestionsController');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post('/', authenticate, upload.array('attachments'), suggestionsController.createSuggestion);
router.get('/', authenticate, suggestionsController.getUserSuggestions);
router.get('/:id', authenticate, suggestionsController.getSuggestionById);

module.exports = router;