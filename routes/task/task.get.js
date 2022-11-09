const { param } = require("express-validator");
const { errorWrap, HttpErrors } = require("../../helpers/errors");
const {Task} = require('../../models')
const router = require("express").Router();
const fs = require("fs");

router.get(
  "/task/:uuid",
  param("uuid"),
  errorWrap(async (req, res) => {
    const { uuid } = req.params;

    const tasks = await Task.findAll()

    res.status(200).json(tasks);
  })
);



module.exports = router;