const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const laundryController = require('../controllers/laundryController');

router.get('/machines', authenticate, laundryController.getMachines);
router.get('/availability/:date', authenticate, laundryController.getAvailability);
router.post('/book', authenticate, laundryController.bookMachine);
router.get('/bookings', authenticate, laundryController.getUserBookings);
router.put('/bookings/:id', authenticate, laundryController.updateBooking);
router.delete('/bookings/:id', authenticate, laundryController.cancelBooking);
router.get('/bookings/:id/qr', authenticate, laundryController.getBookingQR);

module.exports = router;