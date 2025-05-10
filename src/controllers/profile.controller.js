const { User } = require('../models/User.model');
const { ApiError } = require('../exceptions/api.error');
const { emailService } = require('../services/email.service');
const { userService } = require('../services/user.service');
const changeName = async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findOne({ where: { email } });

  user.name = name;
  await user.save();

  res.send({ message: 'OK' });
};

const changeEmail = async (req, res) => {
  const { newEmail, oldEmail, password } = req.body;
  const user = await User.findOne({
    where: { email: oldEmail },
  });

  if (password !== user.password) {
    throw ApiError.BadRequest('Wrong password');
  }

  await emailService.send({
    email: oldEmail,
    subject: 'Email is changed',
    html: `
    <h1>You email was changed to ${newEmail}</h1>
  `,
  });

  user.email = newEmail;
  await user.save();

  res.send(userService.normalize(user));
};

module.exports.profileController = {
  changeName,
  changeEmail,
};
