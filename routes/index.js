const express = require('express');
const { celebrate, Joi } = require('celebrate');

const { userRouter } = require('./users');
const { cardRouter } = require('./cards');
const { login, createUser } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const { RegExp } = require('../utils/const');

const routes = express.Router();

routes.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }),
  }),
  login,
);

routes.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(RegExp),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
    }),
  }),
  createUser,
);

routes.use('/users', auth, userRouter);
routes.use('/cards', auth, cardRouter);
routes.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = { routes };
