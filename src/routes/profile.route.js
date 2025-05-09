const express = require('express');
const { profileController } = require('../controllers/profile.controller');
const { catchError } = require('../utils/catchError');

const profileRouter = new express.Router();

profileRouter.post('/', catchError(profileController.changeName));

module.exports = { profileRouter };
