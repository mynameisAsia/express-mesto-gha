const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  ok,
  okCreated,
  badRequest,
  authError,
  notFound,
  conflict,
  internalError,
} = require('../constants/errors');

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, { maxAge: 3600000, httpOnly: true }).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        token,
      });
    })
    .catch((err) => {
      res.status(authError).send({ message: err.message });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(ok).send({ data: users }))
    .catch(() => res.status(internalError).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(notFound).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(ok).send({ data: user });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные пользователя' });
      } else {
        res.status(internalError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    // eslint-disable-next-line object-curly-newline
    .then(() => res.status(okCreated).send({ data: { name, about, avatar, email } }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      } else if (err.code === 11000) {
        res.status(conflict).send({ message: 'Такой email уже существует' });
      } else {
        res.status(internalError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.getCurrentUser = (req, res) => {
  const { userId } = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(notFound).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(ok).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({
          message: 'Передан некорректный _id пользователя',
        });
      } else {
        res.status(internalError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(notFound).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(ok).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      } else if (err.name === 'CastError') {
        res.status(badRequest).send({
          message: 'Передан некорректный _id пользователя',
        });
      } else {
        res.status(internalError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(notFound).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(ok).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      } else if (err.name === 'CastError') {
        res.status(badRequest).send({
          message: 'Передан некорректный _id пользователя',
        });
      } else {
        res.status(internalError).send({ message: 'Произошла ошибка' });
      }
    });
};
