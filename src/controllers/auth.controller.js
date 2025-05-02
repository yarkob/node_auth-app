const { User } = require('../models/User.model');
const { emailService } = require('../services/email.service');
const { v4 } = require('uuid');
const uuidv4 = v4;

const authController = (req, res) => {
  res.send('hello world');
};

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const activationToken = uuidv4();

  const newUser = await User.create({
    name,
    email,
    password,
    activationToken,
  });

  await emailService.sendActivationEmail(email, activationToken);

  res.send(newUser);
};

const activate = async (req, res) => {
  const { activationToken } = req.params;
  const user = await User.findOne({ where: { activationToken } });

  if (!user) {
    res.sendStatus(404);

    return;
  }

  user.activationToken = null;
  user.save();
};

module.exports = {
  authController,
  register,
  activate,
};
