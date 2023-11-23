const { Card } = require('../models/card');

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
    const card = await Card.findByIdAndDelete(cardId).populate('owner');
    if (!card) {
      const err = new Error('Карточка с указанным _id не найдена.');
      err.name = 'NotFoundError';
      throw err;
    }
    const ownerId = card.owner.id;
    const userId = req.user._id;
    if (ownerId !== userId) {
      res.status(403).send({
        message: 'Нельзя удалить карточки других пользователей',
      });
      return;
    }
    res.send(card);
  } catch (err) {
    if (err.name === 'NotFoundError') {
      res.status(404).send({
        message: err.message,
      });
    } else if (err.name === 'CastError') {
      res.status(400).send({
        message: 'Передан некорректный _id карточки',
      });
    } else {
      next(err);
    }
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const ownerId = req.user._id;
    const card = await Card.create({ name, link, owner: ownerId });
    res.status(201).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: 'Переданы некорректные данные при создании карточки.',
      });
    } else {
      next(err);
    }
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
      res.status(404).send({
        message: 'Передан несуществующий _id карточки.',
      });
      return;
    }
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({
        message: 'Переданы некорректные данные',
      });
    } else {
      next(err);
    }
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
      res.status(404).send({
        message: 'Передан несуществующий _id карточки.',
      });
      return;
    }
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({
        message: 'Переданы некорректные данные',
      });
    } else {
      next(err);
    }
  }
};

module.exports = {
  getCards,
  deleteCardById,
  createCard,
  dislikeCard,
  likeCard,
};
