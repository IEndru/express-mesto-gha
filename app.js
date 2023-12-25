const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { routes } = require('./routes');
const { handleError } = require('./middlewares/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests
});

const app = express();

// Подключение к MongoDB
mongoose.connect(DB_URL)
  .then(() => {
    console.log('Подключение к MongoDB успешно установлено');
  })
  .catch((error) => {
    console.log('Ошибка при подключении к MongoDB:', error);
  });

app.use(limiter);

app.use(requestLogger);

app.use(helmet());

app.use(express.json());

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
