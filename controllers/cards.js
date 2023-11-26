const { Card } = require('../models/card');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    next(err);
  }
  return null;
};

const deleteCardById = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId).populate('owner');
    if (!card) {
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    }
    const ownerId = card.owner.id;
    const userId = req.user._id;
    if (ownerId !== userId) {
      throw new ForbiddenError('Нельзя удалить карточки других пользователей');
    }
    await Card.findByIdAndRemove(cardId);
    res.send(card);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      next(new ValidationError('Передан некорректный _id карточки'));
    }
    next(error);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const ownerId = req.user._id;
    const card = await Card.create({ name, link, owner: ownerId });
    res.status(201).send(card);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new ValidationError('Переданы некорректные данные'));
    }
    next(err);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userId } }, // убрать _id из массива
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Передан несуществующий _id карточки');
    }
    res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new ValidationError('Переданы некорректные данные'));
    }
    next(err);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: userId } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Передан несуществующий _id карточки');
    }
    res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new ValidationError('Переданы некорректные данные'));
    }
    next(err);
  }
};

module.exports = {
  getCards,
  deleteCardById,
  createCard,
  dislikeCard,
  likeCard,
};
