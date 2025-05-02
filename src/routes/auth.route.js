const express = require('express');
const { authController, register } = require('../controllers/auth.controller');

const authRouter = new express.Router();

authRouter.post('/', authController);

authRouter.post('/registration', register);

authRouter.post('/activation/:activationToken');

module.exports = {
  authRouter,
};
