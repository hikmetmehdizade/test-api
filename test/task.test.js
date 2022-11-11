const request = require('supertest');
const app = require('../app.js');
const { taskMock } = require('./mock/task');
const models = require('../models');
const { v4: uuidV4 } = require('uuid');

describe('task', () => {
  beforeEach(() => {
    jest.setTimeout(60000);
  });

  describe('create task', () => {
    test('create task: success', async () => {
      const payload = taskMock();

      return request(app)
        .post('/task')
        .send(payload)
        .set('Accept', 'application/json')
        .then((res) => {
          expect(res.statusCode).toBe(201);
          expect(res.body).toEqual(
            expect.objectContaining({
              uuid: expect.any(String),
              title: expect.any(String),
              isDone: expect.any(Boolean),
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
            })
          );
        });
    });

    test('create task: Bad Request', async () => {
      const payload = { title: 'Id', isDone: 555 };

      return request(app)
        .post('/task')
        .send(payload)
        .set('Accept', 'application/json')
        .then((res) => {
          expect(res.statusCode).toBe(403);
        });
    });
  });

  describe('get task', () => {
    describe('find many', () => {
      test('find all tasks', async () => {
        const tasks = await models.Task.findAll({
          raw: true,
        });

        return request(app)
          .get('/tasks')
          .then((res) => {
            expect(res.statusCode).toBe(200);
          });
      });
    });

    describe('find one', () => {
      test('find one by id', async () => {
        const task = await models.Task.findOne();

        return request(app)
          .get(`/task/${task.uuid}`)
          .then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(task);
          });
      });

      test('find one with error: Not found', async () => {
        const uuid = uuidV4();
        return request(app)
          .get(`/task/${uuid}`)
          .then((res) => {
            expect(res.statusCode).toBe(404);
            expect(res.body.message).toEqual('Task not found');
          });
      });

      test('find one with error: Bad Request', async () => {
        const uuid = uuidV4() + '4577';
        return request(app)
          .get(`/task/${uuid}`)
          .then((res) => {
            expect(res.statusCode).toBe(403);
            expect(res.body.message).toEqual(
              `Invalid value uuid in params - ${uuid}`
            );
          });
      });
    });
  });

  describe('should update task', () => {
    beforeEach(() => {
      jest.setTimeout(60000);
    });

    test('update:success', async () => {
      const payload = { isDone: true };
      const task = await models.Task.findOne();
      return request(app)
        .patch(`/task/${task.uuid}`)
        .send(payload)
        .set('Accept', 'application/json')
        .then((res) => {
          expect(res.statusCode).toBe(200);
          models.Task.findByPk(res.body.uuid, { raw: true }).then((data) => {
            expect(res.body).toEqual(data);
          });
        });
    });

    test('update:task not found', async () => {
      const uuid = uuidV4();

      return request(app)
        .patch(`/task/${uuid}`)
        .set({ isDone: true })
        .set('Accept', 'application/json')
        .then((res) => {
          expect(res.statusCode).toBe(404);
          expect(res.body.message).toBe('Task not found');
        });
    });
  });

  describe('delete task', () => {
    beforeEach(() => {
      jest.setTimeout(60000);
    });

    test('delete task: success', async () => {
      const task = await models.Task.findOne();

      return request(app)
        .delete(`/task/${task.uuid}`)
        .set('Accept', 'application/json')
        .then((res) => {
          expect(res.statusCode).toBe(204);
        });
    });

    test('delete task with error: Not found', async () => {
      const uuid = uuidV4();

      return request(app)
        .delete(`/task/${uuid}`)
        .set('Accept', 'application/json')
        .then((res) => {
          expect(res.statusCode).toBe(404);
          expect(res.body.message).toEqual('Task not found');
        });
    });

    test('delete task with error: Bad Request', async () => {
      const uuid = uuidV4() + '4578';

      return request(app)
        .delete(`/task/${uuid}`)
        .then((res) => {
          expect(res.statusCode).toBe(403);
          expect(res.body.message).toEqual(
            `Invalid value uuid in params - ${uuid}`
          );
        });
    });
  });
});
