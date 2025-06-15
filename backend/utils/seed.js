const sequelize = require('../config/database');
const { User, Machine, ValidRoom } = require('../models');

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced (force).');

    // Seed valid rooms 101-110
    const roomNumbers = Array.from({ length: 10 }, (_, i) => (101 + i).toString());
    await Promise.all(
      roomNumbers.map((room) => ValidRoom.create({ roomNumber: room }))
    );
    console.log('Valid rooms seeded.');

    // Seed default admin
    await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@quickbook.com',
      roomNumber: 'ADMIN',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Default admin created.');

    // Seed laundry machines: 3 washers, 3 dryers
    const machines = [];
    for (let i = 1; i <= 3; i++) {
      machines.push({ name: `Washer ${i}`, type: 'washer', status: 'available' });
    }
    for (let i = 1; i <= 3; i++) {
      machines.push({ name: `Dryer ${i}`, type: 'dryer', status: 'available' });
    }
    await Promise.all(machines.map((m) => Machine.create(m)));
    console.log('Laundry machines seeded.');

    console.log('Seeding completed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();