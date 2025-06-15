const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

router.use(authenticate, authorize('admin'));

router.get('/users', adminController.getUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

router.get('/bookings', adminController.getBookings);
router.get('/analytics', adminController.getAnalytics);

router.put('/machines/:id', adminController.updateMachineStatus);

router.get('/suggestions', adminController.getSuggestions);
router.put('/suggestions/:id', adminController.updateSuggestion);

router.post('/announcements', adminController.sendAnnouncement);

module.exports = router;