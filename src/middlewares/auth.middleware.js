const { jwtService } = require('../services/jwt.service');

module.exports.authMiddleware = (req, res, next) => {
  const authorization = req.headers['authorization'] || '';
  const token = authorization.split(' ')[1];

  if (!authorization || !token) {
    res.sendStatus(401);

    return;
  }

  const userData = jwtService.verify(token);

  if (!userData) {
    res.sendStatus(401);

    return;
  }

  next();
};
