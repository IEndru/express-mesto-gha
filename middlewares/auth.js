const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/const');

function auth(req, res, next) {
  let payload;
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      const error = new Error('Невалидные почта или пароль');
      error.statusCode = 401;
      throw error;
    }
    const token = authorization.replace('Bearer ', '');
    const secret = JWT_SECRET || 'default_secret';
    try {
      payload = jwt.verify(token, secret);
    } catch (err) {
      const error = new Error('Невалидные почта или пароль');
      error.statusCode = 401;
      throw error;
    }
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { auth };
