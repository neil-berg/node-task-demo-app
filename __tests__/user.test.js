const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = require('../src/app');
const User = require('../src/models/user');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

describe('POST /users', () => {
  test('Should signup a new user', async () => {
    const response = await request(app)
      .post('/users/')
      .send({
        name: 'Neil',
        email: 'neil@example.com',
        password: 'red1234!'
      })
      .expect(201);

    // Assert that database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assertions about the response
    expect(response.body).toMatchObject({
      user: {
        name: 'Neil',
        email: 'neil@example.com'
      },
      token: user.tokens[0].token
    });

    // Assert that password is not stored as plaintext
    expect(user.password).not.toBe('red1234!');
  });

  test('Should not signup user with invalid name/email/password', async () => {
    // userOne already exists, so signup should fail due to
    // non-unique email
    await request(app)
      .post('/users')
      .send({
        name: userOne.name,
        email: userOne.email,
        password: userOne.password
      })
      .expect(400);
  });
});

describe('POST /users/login', () => {
  test('Should login existing user', async () => {
    // Login the user
    const res = await request(app)
      .post('/users/login')
      .send({
        email: userOne.email,
        password: userOne.password
      })
      .expect(200);

    // Response is an object container the user and the new token
    // Assert that token in response matches mockUser's second token
    const user = await User.findById(userOneId);
    expect(res.body.token).toBe(user.tokens[1].token);
  });

  test('Should not login nonexistent user', async () => {
    await request(app)
      .post('/users/login')
      .send({
        email: userOne.email,
        password: 'ajajajsj'
      })
      .expect(400);
  });
});

describe('GET /users/me', () => {
  test('Should get profile for user', async () => {
    await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);
  });

  test('Should not get profile for unauthenticated user', async () => {
    await request(app)
      .get('/users/me')
      .send()
      .expect(401);
  });
});

describe('DELETE /users/me', () => {
  test('Should delete account for user', async () => {
    await request(app)
      .delete('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);

    // Assert that mockUser is not present in the database
    const user = await User.findById(userOneId);
    expect(user).toBeNull();
  });

  test('Should not delete account for unauthenticated user', async () => {
    await request(app)
      .delete('/users/me')
      .send()
      .expect(401);
  });
});

describe('POST /users/me/avatar', () => {
  test('Should upload avatar image', async () => {
    await request(app)
      .post('/users/me/avatar')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .attach('avatar', '__tests__/fixtures/profile-pic.jpg')
      .expect(200);

    // Assert that image is stored as a buffer in DB
    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
  });
});

describe('PATCH /users/me', () => {
  test('Should update valid user fields', async () => {
    const res = await request(app)
      .patch('/users/me')
      .send({
        name: 'Updated User Name'
      })
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .expect(200);

    // Assert that name updated in response
    expect(res.body.name).toBe('Updated User Name');

    // Assert that name updated in database
    const user = await User.findById(userOneId);
    expect(user.name).toBe('Updated User Name');
  });

  test('Should not update user if unauthenticated', async () => {
    await request(app)
      .patch('/users/me')
      .send({ name: 'Updated User Name' })
      .expect(401);
  });

  test('Should not update invalid user fields', async () => {
    await request(app)
      .patch('/users/me')
      .send({
        location: '111 Main St'
      })
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .expect(400);
  });

  test('Should not update user with invalid name/email/password', async () => {
    await request(app)
      .patch('/users/me')
      .send({ password: '2short' })
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .expect(400);
  });
});
