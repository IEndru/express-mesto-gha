const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/const');
const UnauthorizedError = require('../errors/UnauthorizedError');

function auth(req, res, next) {
  let payload;
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedError('Невалидные почта или пароль');
    }
    const token = authorization.replace('Bearer ', '');
    const secret = JWT_SECRET || 'default_secret';
    try {
      payload = jwt.verify(token, secret);
    } catch (err) {
      throw new UnauthorizedError('Невалидные почта или пароль');
    }
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { auth };
