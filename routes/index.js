const express = require('express');

const { userRouter } = require('./users');
const { cardRouter } = require('./cards');

const routes = express.Router();

routes.use('/users', userRouter);
routes.use('/cards', cardRouter);
routes.use((req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = { routes };
