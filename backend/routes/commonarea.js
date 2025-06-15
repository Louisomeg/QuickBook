const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const commonAreaController = require('../controllers/commonAreaController');

router.get('/availability/:date', authenticate, commonAreaController.getAvailability);
router.post('/book', authenticate, commonAreaController.bookArea);
router.get('/bookings', authenticate, commonAreaController.getUserBookings);
router.put('/bookings/:id', authenticate, commonAreaController.updateBooking);
router.delete('/bookings/:id', authenticate, commonAreaController.cancelBooking);
router.get('/rules', authenticate, commonAreaController.getRules);

module.exports = router;