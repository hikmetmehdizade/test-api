const request = require("supertest");
const app = require("../app.js");
const { taskMock } = require("./mock/task");
const fs = require("fs");

const getTasks = async () => {
  const data = fs.readFileSync(`${global.appRoot}/data/tasks.json`);
  const tasks = JSON.parse(data);

  return tasks;
};

describe("task", () => {
  let tasks = [];
  let task = {};

  beforeAll(async () => {
    tasks = getTasks();
  });

  beforeEach(() => {
    jest.setTimeout(60000);
  });

  test("get task", async () => {
    return request(app)
      .get("/tasks")
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.arrayContaining(tasks));
      });

  });

  describe("create task", () => {
    test("create task: success", async () => {
      const payload = taskMock();

      return request(app)
        .post("/task")
        .send(payload)
        .set("Accept", "application/json")
        .then((res) => {
          expect(res.statusCode).toBe(201);
          // expect(res.body).toHaveBeenCalledWith(expect.objectContaining({
          //   uuid: expect.any(String),
          //   title: expect.any(String),
          //   isDone: expect.any(Boolean),
          //   createdAt: expect.any(Date)
          // }));
        });
    });

    test("create task: Bad Request", async () => {
      const payload = { title: "Id", isDone: 555 };

      return request(app)
        .post("/task")
        .send(payload)
        .set("Accept", "application/json")
        .then((res) => {
          expect(res.statusCode).toBe(403);
        });
    });
  });

  describe("should update task", () => {
    test("update:success", async () => {
      const payload = { isDone: true };

      return request(app)
        .patch(`/task/${tasks[0].uuid}`)
        .send(payload)
        .set("Accept", "application/json")
        .then((res) => {
          expect(res.statusCode).toBe(403);
        });
    });
  });
});
