const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { routes } = require('./routes');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

// Подключение к MongoDB
mongoose.connect(DB_URL)
  .then(() => {
    console.log('Подключение к MongoDB успешно установлено');
  })
  .catch((error) => {
    console.log('Ошибка при подключении к MongoDB:', error);
  });

app.use(helmet());

app.use((req, res, next) => {
  req.user = {
    _id: '654a6de807c87dcb94df544c',
  };
  next();
});

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
