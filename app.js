const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { routes } = require('./routes');

const { PORT = 3000 } = process.env;

const app = express();

// Подключение к MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
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

app.use(routes);

app.use((req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
