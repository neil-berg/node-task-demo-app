const request = require('supertest');

const app = require('../src/app');
const Task = require('../src/models/task');

const {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase
} = require('./fixtures/db');

beforeEach(setupDatabase);

describe('POST /tasks', () => {
  test('Should create task for user', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        description: 'Testing application'
      })
      .expect(201);

    const task = await Task.findById(res.body._id);
    // Assert:
    // 1. Non-null task
    // 2. Default property of completed set to false
    // 3. Task owner is userOne
    expect(task).not.toBeNull();
    expect(task.completed).toBe(false);
    expect(task.owner).toEqual(userOneId);
  });

  test('Should not create task for unauthenticated user', async () => {
    await request(app)
      .post('/tasks')
      .send({ description: 'Testing app without auth' })
      .expect(401);
  });

  test('Should not create task with invalid description/completed', async () => {
    await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({ completed: 'yes' })
      .expect(400);
  });
});

describe('GET /tasks', () => {
  test('Should get all tests from userOne', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);

    expect(res.body.length).toBe(2);
  });

  test('Should fetch only completed tasks', async () => {
    const res = await request(app)
      .get('/tasks/?completed=true')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .expect(200);

    expect(res.body.length).toBe(1);
  });

  test('Should fetch only incomplete tasks', async () => {
    const res = await request(app)
      .get('/tasks/?completed=false')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .expect(200);

    expect(res.body.length).toBe(1);
  });

  test('Should sort tasks by description/completed/createdAt/updatedAt', async () => {
    const res = await request(app)
      .get('/tasks/?sortBy=createdAt:desc')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .expect(200);

    expect(res.body).not.toBeNull();
  });
});

describe('GET /tasks/:id', () => {
  test('Should fetch user task by id', async () => {
    const res = await request(app)
      .get(`/tasks/${taskOne._id}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .expect(200);

    const task = res.body.task;
    expect(task).not.toBeNull();
  });

  test('Should not fetch user task by id if unauthenticated', async () => {
    await request(app)
      .get(`/tasks/${taskOne._id}`)
      .expect(401);
  });

  test('Should not fetch other users task by id', async () => {
    await request(app)
      .get(`/tasks/${taskOne._id}`)
      .set('Authentication', `Bearer ${userTwo.tokens[0].token}`)
      .expect(401);
  });
});

describe('PATCH /tasks/:id', () => {
  test('Should not update task with invalid description/completed', async () => {
    await request(app)
      .patch(`/tasks/${taskOne._id}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({ completed: 'yes' })
      .expect(400);
  });

  test('Should not update other users tasks', async () => {
    await request(app)
      .patch(`/tasks/${taskOne._id}`)
      .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
      .send({ completed: false })
      .expect(404);
  });
});

describe('DELETE /tasks/:id', () => {
  test('Should delete user task', async () => {
    await request(app)
      .delete(`/tasks/${taskOne._id}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);

    const task = await Task.findById(taskOne._id);
    expect(task).toBeNull();
  });

  test('Should not delete task if unauthenticated', async () => {
    await request(app)
      .delete(`/tasks/${taskOne._id}`)
      .send()
      .expect(401);
  });

  test('Should not delete task when user is not task owner', async () => {
    const res = await request(app)
      .delete(`/tasks/${taskOne._id}`)
      .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
      .send()
      .expect(404);

    // Assert that taskOne is still in the database after failed deletetion
    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
  });
});
