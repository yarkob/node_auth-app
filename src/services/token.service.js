const { Token } = require('../models/token.model');

const save = async (userId, newToken) => {
  const token = await Token.findOne({ where: { userId } });

  if (!token) {
    await Token.create({ userId, refreshToken: newToken });

    return;
  }

  token.refreshToken = newToken;
  await token.save();
};

const getByToken = async (refreshToken) => {
  return Token.findOne({ where: { refreshToken } });
};

const remove = (userId) => {
  return Token.destroy({ where: { userId } });
};

module.exports.tokenService = {
  save,
  getByToken,
  remove,
};
