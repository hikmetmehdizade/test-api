const router = require("express").Router();
const { errorWrap, HttpErrors, AppError } = require("../../helpers/errors");
const { body, validationResult } = require("express-validator");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const tasksFile = `${global.appRoot}/data/tasks.json`;

router.post(
  "/task",
  body("title").isString().isLength({ min: 3 }).notEmpty(),
  body("isDone").isBoolean().optional(),
  errorWrap(async (req, res) => {
    if (!validationResult(req).isEmpty()) {
      throw HttpErrors.BadRequest();
    }
    const newTask = {
      ...req.body,
      uuid: uuid(),
      createdAt: new Date().toISOString(),
    };

    const data = await fs.readFileSync(tasksFile, "utf-8");
    const tasks = JSON.parse(data);

    tasks.push(newTask);

    await fs.writeFileSync(tasksFile, JSON.stringify(tasks, undefined, 2), {
      encoding: "utf-8",
    });

    res.status(201).json(req.body);
  })
);

module.exports = router;
