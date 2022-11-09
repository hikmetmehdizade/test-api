const router = require("express").Router();
const fs = require("fs");
const { body, validationResult } = require("express-validator");
const { errorWrap, HttpErrors } = require("../../helpers/errors");

router.delete(
  "/task/:uuid",
  body("uuid").isUUID(4),
  errorWrap(async (req, res) => {
    validationResult(req).throw();

    const { uuid } = req.params;
    const data = fs.readFileSync(`${global.appRoot}/data/tasks.json`, "utf8");
    const tasks = JSON.parse(data);

    const foundTaskIndex = tasks.find((item) => item.uuid === uuid);

    if (foundTaskIndex === -1) {
      throw HttpErrors.NotFound("Task not found");
    }

    const filteredTasks = tasks.filter((item) => item.uuid !== uuid);

    fs.writeFileSync(
      `${global.appRoot}/data/tasks.json`,
      JSON.stringify(filteredTasks, undefined, 2)
    );

    res.status(204).json("Task deleted successfully");
  })
);

module.exports = router;
