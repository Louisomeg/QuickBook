const { User, LaundryBooking, CommonAreaBooking, Machine, Suggestion, Notification } = require('../models');

exports.getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  try {
    const { count, rows } = await User.findAndCountAll({ limit, offset });
    res.json({ total: count, page, pages: Math.ceil(count / limit), users: rows });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { isActive, role } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (typeof isActive === 'boolean') user.isActive = isActive;
    if (role) user.role = role;
    await user.save();
    res.json({ message: 'User updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getBookings = async (req, res) => {
  const { type, status, date } = req.query;
  try {
    let bookings;
    if (type === 'laundry') {
      bookings = await LaundryBooking.findAll({ where: { ...(status && { status }) } });
    } else if (type === 'common') {
      bookings = await CommonAreaBooking.findAll({ where: { ...(status && { status }), ...(date && { date }) } });
    } else {
      bookings = {
        laundry: await LaundryBooking.findAll({ where: { ...(status && { status }) } }),
        common: await CommonAreaBooking.findAll({ where: { ...(status && { status }), ...(date && { date }) } }),
      };
    }
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalLaundry = await LaundryBooking.count();
    const totalCommon = await CommonAreaBooking.count();
    res.json({ totalUsers, totalLaundry, totalCommon });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateMachineStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const machine = await Machine.findByPk(id);
    if (!machine) return res.status(404).json({ message: 'Machine not found' });
    machine.status = status;
    await machine.save();
    res.json({ message: 'Machine status updated', machine });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getSuggestions = async (req, res) => {
  const { status } = req.query;
  try {
    const suggestions = await Suggestion.findAll({ where: { ...(status && { status }) } });
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateSuggestion = async (req, res) => {
  const { id } = req.params;
  const { status, adminResponse } = req.body;
  try {
    const suggestion = await Suggestion.findByPk(id);
    if (!suggestion) return res.status(404).json({ message: 'Suggestion not found' });
    if (status) suggestion.status = status;
    if (adminResponse) suggestion.adminResponse = adminResponse;
    await suggestion.save();
    // Notify user about suggestion update
    const notification = await Notification.create({
      userId: suggestion.userId,
      title: 'Suggestion Updated',
      message: `Your suggestion '${suggestion.title}' status updated to ${suggestion.status}.`,
      type: 'suggestion',
    });
    const io = req.app.get('io');
    io.to(suggestion.userId).emit('notification', notification);
    res.json({ message: 'Suggestion updated', suggestion });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.sendAnnouncement = async (req, res) => {
  const { title, message, type } = req.body;
  try {
    const users = await User.findAll({ where: { isActive: true } });
    const notificationsData = users.map((u) => ({ userId: u.id, title, message, type }));
    const notifications = await Notification.bulkCreate(notificationsData);
    // Emit real-time notifications to all users
    const io = req.app.get('io');
    notifications.forEach((n) => {
      io.to(n.userId).emit('notification', n);
    });
    res.status(201).json({ message: 'Announcements sent' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};