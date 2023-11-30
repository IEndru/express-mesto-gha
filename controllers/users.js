const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { JWT_SECRET } = require('../utils/const');
const ValidationError = require('../errors/ValidationError');
const DuplicateError = require('../errors/DuplicateError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const SАLT_ROUNDS = 10;
const MONGO_DUPLICATE_ERROR_CODE = 11000;

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
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    }
    res.status(200).send(user);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      next(new ValidationError('Переданы некорректные данные'));
      return;
    }
    next(error);
  }
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
    const hash = await bcrypt.hash(password, SАLT_ROUNDS);
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
    if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
      next(new DuplicateError('Такой пользователь уже существует'));
      // eslint-disable-next-line consistent-return
      return;
    }
    if (err.name === 'ValidationError') {
      next(new ValidationError('Переданы некорректные данные при создании пользователя'));
      // eslint-disable-next-line consistent-return
      return;
    }
    next(err);
  }
  return null;
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email })
      .select('+password')
      .orFail(() => new UnauthorizedError('Не правильные email или password'));
    if (!user || !(await bcrypt.compare(password, user.password))) {
      next(new UnauthorizedError('Не правильные email или password'));
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    const allowedKeys = ['name', 'about'];
    const isValidUpdate = Object.keys(req.body).every((key) => allowedKeys.includes(key));

    if (!isValidUpdate) {
      throw new ValidationError('Переданы некорректные данные при обновлении профиля.');
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Пользователь с указанным _id не найден.');
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const allowedKeys = ['avatar'];
    const isValidUpdate = Object.keys(req.body).every((key) => allowedKeys.includes(key));
    if (!isValidUpdate) {
      throw new ValidationError('Переданы некорректные данные при обновлении аватара.');
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true },
    );
    if (!user) {
      throw new NotFoundError('Пользователь с указанным _id не найден.');
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const userId = req.user._id;
    console.log(userId);
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new ValidationError('Переданы некорректные данные'));
      return;
    }
    next(err);
  }
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
