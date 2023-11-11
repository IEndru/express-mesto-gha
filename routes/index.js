const express = require('express');

const { userRouter } = require('./users');
const { cardRouter } = require('./cards');

const routes = express.Router();

routes.use('/users', userRouter);
routes.use('/cards', cardRouter);

module.exports = { routes };
