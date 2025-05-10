const express = require('express');
const { profileController } = require('../controllers/profile.controller');
const { catchError } = require('../utils/catchError');

const profileRouter = new express.Router();

profileRouter.post('/name', catchError(profileController.changeName));

profileRouter.post('/email', catchError(profileController.changeEmail));

profileRouter.post('/password', catchError(profileController.changePassword));

module.exports = { profileRouter };
