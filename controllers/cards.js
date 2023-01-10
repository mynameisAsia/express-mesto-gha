/* eslint-disable consistent-return */
const Card = require('../models/card');
const {
  ok,
  okCreated,
  badRequest,
  forbidden,
  notFound,
  internalError,
} = require('../constants/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(ok).send({ data: cards }))
    .catch(() => res.status(internalError).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(okCreated).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      } else {
        res.status(internalError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(notFound).send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      if (!card.owner.equals(req.user._id)) {
        res.status(forbidden).send({ message: 'Вы не можете удалять чужие карточки' });
        return;
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then(() => {
          res.status(ok).send({ message: 'Карточка удалена' });
        });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(badRequest).send({
          message: 'Переданы некорректные данные для удаления карточки',
        });
      } else {
        res.status(internalError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(notFound).send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      res.status(ok).send({ data: card });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(badRequest).send({
          message: 'Переданы некорректные данные для проставления лайка',
        });
      } else {
        res.status(internalError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.removeLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(notFound).send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      res.status(ok).send({ data: card });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(badRequest).send({
          message: 'Переданы некорректные данные для удаления лайка',
        });
      } else {
        res.status(internalError).send({ message: 'Произошла ошибка' });
      }
    });
};
