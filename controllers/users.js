const { User } = require('../models/user');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    return res
      .status(500)
      .send({ message: 'Не получилось обработать запрос', error: error.message });
  }
  return null;
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('NotFound');
    }
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    if (error.message === 'NotFound') {
      return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
    }

    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Передан не валидный id' });
    }

    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
  return null;
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.status(201).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: 'Переданы некорректные данные при создании пользователя',
      });
    } else {
      res.status(500).send({
        message: 'Ошибка по умолчанию.',
      });
    }
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    const allowedKeys = ['name', 'about'];
    const isValidUpdate = Object.keys(req.body).every((key) => allowedKeys.includes(key));

    if (!isValidUpdate) {
      return res.status(400).send({
        message: 'Переданы некорректные данные при обновлении профиля.',
      });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(404).send({
        message: 'Пользователь с указанным _id не найден.',
      });
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: 'Переданы некорректные данные',
      });
    } else {
      res.status(500).send({
        message: 'Не получилось обработать запрос',
      });
    }
  }
  return null;
};

const updateAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const allowedKeys = ['avatar'];
    const isValidUpdate = Object.keys(req.body).every((key) => allowedKeys.includes(key));

    if (!isValidUpdate) {
      return res.status(400).send({
        message: 'Переданы некорректные данные при обновлении аватара.',
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true },
    );

    if (!user) {
      return res.status(404).send({
        message: 'Пользователь с указанным _id не найден.',
      });
    }

    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: 'Переданы некорректные данные',
      });
    } else {
      res.status(500).send({
        message: 'Не получилось обработать запрос',
      });
    }
  }
  return null;
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
