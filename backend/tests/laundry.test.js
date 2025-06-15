const request = require('supertest');
const server = require('../server');
const { sequelize, ValidRoom, User, Machine } = require('../models');

describe('Laundry Booking Endpoints', () => {
  let token;
  let machineId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    // Seed valid room and admin
    await ValidRoom.create({ roomNumber: '102' });
    const user = await User.create({ firstName: 'LB', lastName: 'User', email: 'lb@example.com', roomNumber: '102', password: 'secret' });
    // Create a machine
    const machine = await Machine.create({ name: 'Washer 1', type: 'washer', status: 'available' });
    machineId = machine.id;
    // Login
    const res = await request(server)
      .post('/api/auth/login')
      .send({ email: 'lb@example.com', password: 'secret' });
    token = res.body.token;
  });

  afterAll(async () => {
    await server.close();
    await sequelize.close();
  });

  it('should get list of machines', async () => {
    const res = await request(server)
      .get('/api/laundry/machines')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].id).toEqual(machineId);
  });

  it('should create a booking', async () => {
    const start = new Date();
    start.setMinutes(start.getMinutes() + 60);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 30);
    const res = await request(server)
      .post('/api/laundry/book')
      .set('Authorization', `Bearer ${token}`)
      .send({ machineId, startTime: start, endTime: end });
    expect(res.statusCode).toEqual(201);
    expect(res.body.id).toBeDefined();
  });
});