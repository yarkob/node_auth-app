const jwt = require('jsonwebtoken');

const sign = (user) => {
  return jwt.sign(user, process.env.JWT_KEY);
};

const verify = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_KEY);
  } catch (e) {
    return null;
  }
};

module.exports.jwtService = {
  sign,
  verify,
};
