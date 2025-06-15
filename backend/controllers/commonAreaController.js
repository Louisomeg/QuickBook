const { CommonAreaBooking, Notification } = require('../models');
const { Op } = require('sequelize');

exports.getAvailability = async (req, res) => {
  const { date } = req.params;
  try {
    const bookings = await CommonAreaBooking.findAll({
      where: { date, status: 'confirmed' },
    });
    const availability = {};
    bookings.forEach((b) => {
      if (!availability[b.areaName]) availability[b.areaName] = [];
      availability[b.areaName].push({ startTime: b.startTime, endTime: b.endTime });
    });
    res.json(availability);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.bookArea = async (req, res) => {
  const userId = req.user.id;
  const { areaName, date, startTime, endTime, purpose, groupSize, specialRequirements } = req.body;
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    // Check conflicts on same area and date
    const conflict = await CommonAreaBooking.findOne({
      where: {
        areaName,
        date,
        status: 'confirmed',
        [Op.or]: [
          { startTime: { [Op.between]: [start, end] } },
          { endTime: { [Op.between]: [start, end] } },
          { [Op.and]: [{ startTime: { [Op.lte]: start } }, { endTime: { [Op.gte]: end } }] },
        ],
      },
    });
    if (conflict) {
      return res.status(400).json({ message: 'Time slot not available' });
    }
    const booking = await CommonAreaBooking.create({
      userId,
      areaName,
      date,
      startTime: start,
      endTime: end,
      purpose,
      groupSize,
      specialRequirements,
    });
    // Create notification for user
    const notification = await Notification.create({
      userId,
      title: 'Common Area Booking Confirmed',
      message: `Your booking for ${areaName} on ${date} from ${start.toISOString()} to ${end.toISOString()} is confirmed.`,
      type: 'booking',
    });
    // Emit real-time notification
    const io = req.app.get('io');
    io.to(userId).emit('notification', notification);
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUserBookings = async (req, res) => {
  const userId = req.user.id;
  try {
    const bookings = await CommonAreaBooking.findAll({ where: { userId } });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateBooking = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { startTime, endTime, purpose, groupSize, specialRequirements } = req.body;
  try {
    const booking = await CommonAreaBooking.findOne({ where: { id, userId, status: 'confirmed' } });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not editable' });
    }
    const start = new Date(startTime);
    const end = new Date(endTime);
    const conflict = await CommonAreaBooking.findOne({
      where: {
        areaName: booking.areaName,
        date: booking.date,
        status: 'confirmed',
        id: { [Op.ne]: booking.id },
        [Op.or]: [
          { startTime: { [Op.between]: [start, end] } },
          { endTime: { [Op.between]: [start, end] } },
          { [Op.and]: [{ startTime: { [Op.lte]: start } }, { endTime: { [Op.gte]: end } }] },
        ],
      },
    });
    if (conflict) {
      return res.status(400).json({ message: 'Time slot not available' });
    }
    booking.startTime = start;
    booking.endTime = end;
    booking.purpose = purpose || booking.purpose;
    booking.groupSize = groupSize || booking.groupSize;
    booking.specialRequirements = specialRequirements || booking.specialRequirements;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const booking = await CommonAreaBooking.findOne({ where: { id, userId, status: 'confirmed' } });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or already processed' });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getRules = async (req, res) => {
  // Static rules; can be extended or loaded from DB
  res.json({
    rules: [
      'Bookings must be made at least 1 hour in advance.',
      'Maximum group size is 20.',
      'Please clean up after use.',
    ],
  });
};