const { validationResult } = require("express-validator");

const validation =
  (schema) =>
  (req, ...args) =>
    Promise.all(schema.map((val) => val(req, ...args)));

module.exports = validation;
