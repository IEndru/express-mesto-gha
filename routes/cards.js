const express = require('express');
const {
  getCards,
  deleteCardById,
  createCard,
  dislikeCard,
  likeCard,
} = require('../controllers/cards');

const cardRouter = express.Router();

cardRouter.get('/', getCards);
cardRouter.delete('/:cardId', deleteCardById);
cardRouter.post('/', express.json(), createCard);
cardRouter.delete('/:cardId/likes', dislikeCard);
cardRouter.put('/:cardId/likes', likeCard);

module.exports = { cardRouter };
