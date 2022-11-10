const request = require('supertest');
const app = require('../app.js');
const { taskMock } = require('./mock/task');
const models = require('../models');
const { v4: uuidV4 } = require('uuid');

const getTasks = async () => {
    const tasks = await models.Task.findAll();
    return tasks;
};

describe('task', () => {
    beforeAll(async () => {
        tasks = getTasks();
    });

    beforeEach(() => {
        jest.setTimeout(60000);
    });

    test('get task', async () => {
        return request(app)
            .get('/tasks')
            .then((res) => {
                expect(res.statusCode).toBe(200);
                // expect(res.body).toEqual(expect.arrayContaining(tasks));
            });
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

    describe('should update task', () => {
        beforeEach(() => {
            jest.setTimeout(60000);
        });

        test('update:success', async () => {
            const payload = { isDone: true };
            const tasks = await models.Task.findAll();

            const result = { ...tasks[0], ...payload };
            return request(app)
                .patch(`/task/${tasks[0].uuid}`)
                .send(payload)
                .set('Accept', 'application/json')
                .then((res) => {
                    expect(res.statusCode).toBe(200);
                    expect(res.body).toEqual(result);
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

        test('delete task', async () => {
            const tasks = await models.Task.findAll();

            return request(app)
                .delete(`/task/${tasks[0].uuid}`)
                .set('Accept', 'application/json')
                .then((res) => {
                    expect(res.statusCode).toBe(204);
                    expect(res.body).toBe('Task deleted successfully');
                });
        });
    });
});
