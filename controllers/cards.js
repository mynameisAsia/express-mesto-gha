/* eslint-disable consistent-return */
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');
const NotFound = require('../errors/NotFound');
const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные при создании карточки');
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('Запрашиваемая карточка не найдена');
      }
      if (!card.owner.equals(req.user._id)) {
        throw new Forbidden('Вы не можете удалять чужие карточки');
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then(() => {
          res.status(200).send({ message: 'Карточка удалена' });
        });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw new Forbidden('Вы не можете удалять чужие карточки');
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFound('Запрашиваемая карточка не найдена');
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw new BadRequest('Переданы некорректные данные для проставления лайка');
      } else {
        next(err);
      }
    });
};

module.exports.removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFound('Запрашиваемая карточка не найдена');
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw new BadRequest('Переданы некорректные данные для удаления лайка');
      } else {
        next(err);
      }
    });
};
