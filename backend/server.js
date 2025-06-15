const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const { sequelize } = require('./models');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
// Static folder for uploads
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.get('/', (req, res) => {
  res.send('QuickBook API is running.');
});

// Auth routes
app.use('/api/auth', require('./routes/auth'));
// Laundry routes
app.use('/api/laundry', require('./routes/laundry'));
// Common area routes
app.use('/api/commonarea', require('./routes/commonarea'));
// Suggestions routes
app.use('/api/suggestions', require('./routes/suggestions'));
// Admin routes
app.use('/api/admin', require('./routes/admin'));

const PORT = process.env.PORT || 5000;
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced');
    const server = http.createServer(app);
    const io = new Server(server, { cors: { origin: '*' } });
    const jwt = require('jsonwebtoken');
    // Authentication middleware for socket connections
    io.use((socket, next) => {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        socket.join(decoded.id);
        if (decoded.role === 'admin') {
          socket.join('admin');
        }
        next();
      } catch (err) {
        next(new Error('Authentication error'));
      }
    });
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id, 'User:', socket.userId);
    });
    app.set('io', io);
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    // Export server for testing
    module.exports = server;
    // Reminder job: run every minute
    const { LaundryBooking, CommonAreaBooking, Notification } = require('./models');
    const sendReminders = async () => {
      const now = new Date();
      const windowStart = new Date(now.getTime() + 29 * 60 * 1000);
      const windowEnd = new Date(now.getTime() + 30 * 60 * 1000);
      try {
        // Laundry reminders
        const laundryBookings = await LaundryBooking.findAll({
          where: {
            status: 'confirmed',
            reminderSent: false,
            startTime: { [require('sequelize').Op.between]: [windowStart, windowEnd] },
          },
        });
        for (const b of laundryBookings) {
          const msg = `Reminder: your laundry booking for machine ${b.machineId} at ${b.startTime.toLocaleString()}`;
          const n = await Notification.create({ userId: b.userId, title: 'Booking Reminder', message: msg, type: 'reminder' });
          const io = app.get('io');
          io.to(b.userId).emit('notification', n);
          b.reminderSent = true;
          await b.save();
        }
        // Common area reminders
        const commonBookings = await CommonAreaBooking.findAll({
          where: {
            status: 'confirmed',
            reminderSent: false,
            startTime: { [require('sequelize').Op.between]: [windowStart, windowEnd] },
          },
        });
        for (const b of commonBookings) {
          const msg = `Reminder: your common area booking for ${b.areaName} at ${b.startTime.toLocaleString()}`;
          const n = await Notification.create({ userId: b.userId, title: 'Booking Reminder', message: msg, type: 'reminder' });
          const io = app.get('io');
          io.to(b.userId).emit('notification', n);
          b.reminderSent = true;
          await b.save();
        }
      } catch (err) {
        console.error('Reminder job error:', err);
      }
    };
    setInterval(sendReminders, 60 * 1000);
  })
  .catch((err) => {
    console.error('Unable to sync database:', err);
  });