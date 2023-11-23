const express = require('express');
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

const userRouter = express.Router();

userRouter.get('/', getUsers);

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
        /^https?:\/\/(www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+#?$/,
      ),
    }),
  }),
  updateAvatar,
);

userRouter.get('/me', getUserInfo);

module.exports = { userRouter };
