const { ApiError } = require('../exceptions/api.error');
const { User } = require('../models/User.model');
const { userService } = require('../services/user.service');
const { jwtService } = require('../services/jwt.service');
const { tokenService } = require('../services/token.service');
const { emailService } = require('../services/email.service');

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

  await generateTokens(res, user);
  res.send(user);
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userService.findByEmail(email);

  if (!user) {
    throw ApiError.BadRequest('User with this email does not exist');
  }

  if (user.password !== password) {
    throw ApiError.BadRequest('Password is wrong');
  }

  await generateTokens(res, user);
};

const refresh = async (req, res) => {
  const { refreshToken } = req.cookies;

  const user = jwtService.verifyRefresh(refreshToken);
  const token = await tokenService.getByToken(refreshToken);

  if (!user || !token) {
    throw ApiError.Unauthorized();
  }

  await generateTokens(res, user);
};

const generateTokens = async (res, user) => {
  const normalizedUser = userService.normalize(user);
  const accessToken = jwtService.sign(normalizedUser);
  const refreshToken = jwtService.signRefresh(normalizedUser);

  await tokenService.save(normalizedUser.id, refreshToken);

  res.cookie('refreshToken', refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  res.send({ user: normalizedUser, accessToken });
};

const logout = async (req, res) => {
  const { refreshToken } = req.cookies;
  const user = await jwtService.verifyRefresh(refreshToken);

  if (!user || !refreshToken) {
    throw ApiError.Unauthorized();
  }

  await tokenService.remove(user.id);

  res.sendStatus(204);
};

const requestChangePassword = async (req, res) => {
  const { email } = req.body;
  const href = `${process.env.CLIENT_HOST}/change-password`;
  const html = `
    <p>To reset your password please click the following link: </p>
    <a href="${href}"}>${href}</a>
  `;

  await emailService.send({ email, subject: 'Reset password', html });

  res.send({ message: 'OK' });
};

const changePassword = async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  const user = await userService.findByEmail(email);

  if (!user) {
    throw ApiError.BadRequest('User with this email does not exist');
  }

  if (password !== confirmPassword) {
    throw ApiError.BadRequest(
      'Password should be the same as confirm password',
    );
  }

  user.password = password;
  user.save();

  res.send({ message: 'OK' });
};

module.exports.authController = {
  register,
  activate,
  login,
  refresh,
  logout,
  requestChangePassword,
  changePassword,
};

module.exports.validation = {
  validateUsername,
  validateEmail,
  validatePassword,
};
