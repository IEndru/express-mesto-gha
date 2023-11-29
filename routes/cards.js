const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { RegExp } = require('../utils/const');

const {
  getCards,
  deleteCardById,
  createCard,
  dislikeCard,
  likeCard,
} = require('../controllers/cards');

const cardRouter = express.Router();

cardRouter.get('/', getCards);

cardRouter.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteCardById,
);

cardRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required()
        .regex(
          RegExp,
        ),
    }),
  }),
  createCard,
);

cardRouter.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  dislikeCard,
);

cardRouter.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  likeCard,
);

module.exports = { cardRouter };
