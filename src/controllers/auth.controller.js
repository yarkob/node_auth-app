const { ApiError } = require('../exceptions/api.error');
const { User } = require('../models/User.model');
const { userService } = require('../services/user.service');
const { jwtService } = require('../services/jwt.service');

const validateUsername = (value) => {
  if (!value) {
    return 'Username is required';
  }

  if (value.length < 3) {
    return 'Username should have at least 3 characters';
  }

  if (value.length > 20) {
    return 'Username should have less than 20 characters';
  }
};

const validateEmail = (value) => {
  if (!value) {
    return 'Email is required';
  }

  const emailPattern = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

  if (!emailPattern.test(value)) {
    return 'Email is not valid';
  }
};

const validatePassword = (value) => {
  if (!value) {
    return 'Password is required';
  }

  if (value.length < 6) {
    return 'At least 6 characters';
  }
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const errors = {
    name: validateUsername(name),
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (errors.name || errors.email || errors.password) {
    throw ApiError.BadRequest('Bad request', errors);
  }

  await userService.register({ name, email, password });

  res.send({ message: 'OK' });
};

const activate = async (req, res) => {
  const { activationToken } = req.params;
  const user = await User.findOne({ where: { activationToken } });

  if (!user) {
    res.sendStatus(500);

    return;
  }

  user.activationToken = null;
  user.save();

  res.send(user);
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userService.findByEmail(email);

  if (!user || user.password !== password) {
    res.send(401);
  }

  const normalizedUser = userService.normalize(user);
  const accessToken = jwtService.sign(normalizedUser);

  res.send({ user: normalizedUser, accessToken });
};

module.exports.authController = {
  register,
  activate,
  login,
};
