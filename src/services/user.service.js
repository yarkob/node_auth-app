const { User } = require('../models/User.model');
const { emailService } = require('./email.service');
const { ApiError } = require('../exceptions/api.error');
const { v4 } = require('uuid');

const uuidv4 = v4;

const getAllActivated = async () => {
  return User.findAll({ where: { activationToken: null } });
};

const normalize = ({ id, email }) => {
  return { id, email };
};

const findByEmail = (email) => {
  return User.findOne({ where: { email } });
};

async function register({ name, email, password }) {
  const existingUser = await findByEmail(email);

  if (existingUser) {
    throw ApiError.BadRequest('Validation error', {
      email: 'Email is already taken',
    });
  }

  const activationToken = uuidv4();

  await User.create({
    name,
    email,
    password,
    activationToken,
  });

  await emailService.sendActivationEmail(email, activationToken);
}

module.exports.userService = {
  getAllActivated,
  normalize,
  findByEmail,
  register,
};
