const { Machine, LaundryBooking, Notification } = require('../models');
const { Op } = require('sequelize');

exports.getMachines = async (req, res) => {
  try {
    const machines = await Machine.findAll();
    res.json(machines);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAvailability = async (req, res) => {
  const { date } = req.params;
  try {
    const start = new Date(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const bookings = await LaundryBooking.findAll({
      where: {
        startTime: { [Op.gte]: start, [Op.lt]: end },
      },
    });
    const availability = {};
    bookings.forEach((b) => {
      if (!availability[b.machineId]) availability[b.machineId] = [];
      availability[b.machineId].push({ startTime: b.startTime, endTime: b.endTime });
    });
    res.json(availability);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.bookMachine = async (req, res) => {
  const userId = req.user.id;
  const { machineId, startTime, endTime } = req.body;
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    // Check conflicts
    const conflict = await LaundryBooking.findOne({
      where: {
        machineId,
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
    const booking = await LaundryBooking.create({ userId, machineId, startTime: start, endTime: end });
    // Create notification for user
    const notification = await Notification.create({
      userId,
      title: 'Laundry Booking Confirmed',
      message: `Your booking for machine ${machineId} from ${start.toISOString()} to ${end.toISOString()} is confirmed.`,
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
    const bookings = await LaundryBooking.findAll({ where: { userId } });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateBooking = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { startTime, endTime } = req.body;
  try {
    const booking = await LaundryBooking.findOne({ where: { id, userId, status: 'confirmed' } });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not editable' });
    }
    const start = new Date(startTime);
    const end = new Date(endTime);
    // Check conflicts excluding current booking
    const conflict = await LaundryBooking.findOne({
      where: {
        machineId: booking.machineId,
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
    const booking = await LaundryBooking.findOne({ where: { id, userId, status: 'confirmed' } });
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

exports.getBookingQR = async (req, res) => {
  // TODO: implement QR code generation
  res.status(501).json({ message: 'QR code generation not implemented' });
};