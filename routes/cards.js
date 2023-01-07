const cardRouter = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  removeLike,
} = require('../controllers/cards');

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.put('/:cardId/likes', likeCard);
cardRouter.delete('/:cardId/likes', removeLike);

module.exports = cardRouter;
