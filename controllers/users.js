const User = require('../models/user');
const {
  ok,
  okCreated,
  badRequest,
  notFound,
  internalError,
} = require('../constants/errors');

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
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(okCreated).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({
          message: 'Переданы некорректные данные при создании пользователя',
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
        res.status(notFound).send({
          message: 'Передан некорректный _id карточки',
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
        res.status(notFound).send({
          message: 'Передан некорректный _id карточки.',
        });
      } else {
        res.status(internalError).send({ message: 'Произошла ошибка' });
      }
    });
};
