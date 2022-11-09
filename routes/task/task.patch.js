const router = require("express").Router();
const { errorWrap, HttpErrors } = require("../../helpers/errors");
const { body, param, validationResult } = require("express-validator");
const fs = require("fs");

router.patch(
  "/task/:uuid",
  param("uuid").isUUID(4).notEmpty(),
  body("isDone").isBoolean().optional(),
  body("title").isString().isLength({ min: 3 }).optional(),
  errorWrap(async (req, res) => {
    validationResult(req).throw();

  
    const {uuid } = req.params;

    const data = await fs.readFileSync(`${global.appRoot}/data/tasks.json`, "utf-8");

    const tasks = JSON.parse(data);

    const foundTaskIndex = tasks.findIndex((item) => item.uuid === uuid);

    if (foundTaskIndex === -1) {
      throw HttpErrors.NotFound("Task not found");
    }

    tasks[foundTaskIndex] = {
      ...tasks[foundTaskIndex],
      ...req.body,
    };

    fs.writeFileSync(
      `${global.appRoot}/data/tasks.json`,
      JSON.stringify(tasks, undefined, 2)
    );

    res.status(201).json(tasks[foundTaskIndex]);
  })
);

module.exports = router;
