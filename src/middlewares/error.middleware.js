const { ApiError } = require('../exceptions/api.error.js');

module.exports.errorMiddleware = (error, req, res, next) => {
  if (error instanceof ApiError) {
    const { status, message, errors } = error;

    res.status(status).send({ message, errors });

    return;
  }

  res.status(500).send({
    message: 'Unexpected error',
  });
};
