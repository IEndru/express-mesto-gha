const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { RegExp } = require('../utils/const');

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

const userRouter = express.Router();

userRouter.get('/', getUsers);
userRouter.get('/me', getUserInfo);

userRouter.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().required().length(24),
    }),
  }),
  getUserById,
);

userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).trim(),
      about: Joi.string().min(2).max(30).trim(),
    }),
  }),
  updateUser,
);

userRouter.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(
        RegExp,
      ),
    }),
  }),
  updateAvatar,
);

module.exports = { userRouter };
