// app.js — входной файл

const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const { PORT = 3000 } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

// подключаем мидлвары, роуты и всё остальное...
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '63b4964259af717ef19ae9d0',
  };

  next();
});
app.use(router);

app.listen(PORT);
