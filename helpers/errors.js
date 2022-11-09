const errorWrap = (func) => async (req, res, next) => await func(req, res, next).catch(next);

class AppError extends Error {
  statusCode;
  constructor({ message, statusCode }) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

const HttpErrors = {
  BadRequest: (message = "Bad Request") =>
    new AppError({ message, statusCode: 403 }),
  NotFound: (message = "Not Found") =>
    new AppError({ message, statusCode: 404 }),
};

module.exports = { errorWrap, AppError, HttpErrors };
