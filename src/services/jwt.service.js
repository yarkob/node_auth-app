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

const signRefresh = (user) => {
  return jwt.sign(user, process.env.JWT_REFRESH_KEY);
};

const verifyRefresh = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_KEY);
  } catch (e) {
    return null;
  }
};

module.exports.jwtService = {
  sign,
  verify,
  signRefresh,
  verifyRefresh,
};
