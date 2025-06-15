const request = require('supertest');
const server = require('../server');
const { sequelize, ValidRoom, User } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
  // Seed a valid room for registration
  await ValidRoom.create({ roomNumber: '101' });
});

afterAll(async () => {
  await server.close();
  await sequelize.close();
});

describe('Auth Endpoints', () => {
  let token;
  it('should register a new user', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ firstName: 'Test', lastName: 'User', email: 'test@example.com', roomNumber: '101', password: 'password' });
    expect(res.statusCode).toEqual(201);
    expect(res.body.token).toBeDefined();
  });

  it('should login an existing user', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it('should get user profile with token', async () => {
    const res = await request(server)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.email).toEqual('test@example.com');
  });
});