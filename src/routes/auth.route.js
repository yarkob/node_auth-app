const express = require('express');
const { authController } = require('../controllers/auth.controller');
const { catchError } = require('../utils/catchError');

const authRouter = new express.Router();

authRouter.post('/registration', catchError(authController.register));

authRouter.get(
  '/activation/:activationToken',
  catchError(authController.activate),
);

authRouter.post('/login', catchError(authController.login));

authRouter.get('/refresh', catchError(authController.refresh));

authRouter.post('/logout', catchError(authController.logout));

authRouter.post(
  '/requestChangePassword',
  catchError(authController.requestChangePassword),
);

authRouter.post('/changePassword', catchError(authController.changePassword));

module.exports = {
  authRouter,
};
