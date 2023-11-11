const { Card } = require('../models/card');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (error) {
    return res
      .status(500)
      .send({ message: 'Не получилось обработать запрос', error: error.message });
  }
  return null;
};

const deleteCardById = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndDelete(cardId);
    if (!card) {
      const error = new Error('Карточка с указанным _id не найдена.');
      error.name = 'NotFoundError';
      throw error;
    }
    res.send(card);
  } catch (err) {
    if (err.name === 'NotFoundError') {
      res.status(404).send({
        message: err.message,
      });
    } else {
      res.status(500).send({
        message: 'Не получилось обработать запрос',
      });
    }
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const ownerId = req.user._id;
    const card = await Card.create({ name, link, owner: ownerId });
    res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: 'Переданы некорректные данные при создании карточки.',
      });
    } else {
      res.status(500).send({
        message: 'Не получилось обработать запрос',
      });
    }
  }
};

const dislikeCard = async (req, res) => {
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
      res.status(500).send({
        message: 'Не получилось обработать запрос',
      });
    }
  }
};

const likeCard = async (req, res) => {
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
      res.status(500).send({
        message: 'Не получилось обработать запрос',
      });
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
