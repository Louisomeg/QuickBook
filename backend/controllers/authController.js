const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, ValidRoom } = require('../models');
require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

exports.register = async (req, res) => {
  const { firstName, lastName, email, roomNumber, password } = req.body;
  try {
    const validRoom = await ValidRoom.findOne({ where: { roomNumber } });
    if (!validRoom) {
      return res.status(400).json({ message: 'Invalid room number' });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const user = await User.create({ firstName, lastName, email, roomNumber, password });
    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  const user = req.user;
  res.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    roomNumber: user.roomNumber,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  });
};

exports.updateProfile = async (req, res) => {
  const user = req.user;
  const { firstName, lastName, email, roomNumber } = req.body;
  try {
    if (email && email !== user.email) {
      const exists = await User.findOne({ where: { email } });
      if (exists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
    }
    if (roomNumber && roomNumber !== user.roomNumber) {
      const validRoom = await ValidRoom.findOne({ where: { roomNumber } });
      if (!validRoom) {
        return res.status(400).json({ message: 'Invalid room number' });
      }
      user.roomNumber = roomNumber;
    }
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    await user.save();
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  const user = req.user;
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Old and new passwords are required' });
  }
  try {
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};