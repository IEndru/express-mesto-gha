const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { JWT_SECRET } = require('../utils/const');

const SOLT_ROUNDS = 10;
const MONGO_DUPLACATE_ERROR_CODE = 11000;

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
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

    next(error);
  }
  return null;
};

const createUser = async (req, res, next) => {
  try {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send({
        message: 'Такой пользователь уже существует',
      });
    }
    const hash = await bcrypt.hash(password, SOLT_ROUNDS);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    const userObject = user.toObject();
    delete userObject.password;
    res.status(201).send(userObject);
  } catch (err) {
    if (err.code === MONGO_DUPLACATE_ERROR_CODE) {
      return res.status(409).send({
        message: 'Такой пользователь уже существует',
        errorCode: err.code,
      });
    }
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: 'Переданы некорректные данные при создании пользователя',
      });
    } else {
      next(err);
    }
  }
  return null;
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email })
      .select('+password')
      .orFail(() => new Error('NotAutanticate'));
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ message: 'Не правильные email или password' });
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token });
  } catch (error) {
    if (error.message === 'NotAutanticate') {
      return res
        .status(401)
        .send({ message: 'Не правильные email или password' });
    }
    next(error);
  }
  return null;
};

const updateUser = async (req, res, next) => {
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
      next(err);
    }
  }
  return null;
};

const updateAvatar = async (req, res, next) => {
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
      next(err);
    }
  }
  return null;
};

const getUserInfo = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({
        message: 'Пользователь не найден.',
      });
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
  return null;
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getUserInfo,
};
