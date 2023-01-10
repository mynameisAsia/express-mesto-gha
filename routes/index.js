const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/users');
const { createCard } = require('../controllers/cards');
const { regexp } = require('../constants/regexp');
const userRouter = require('./users');
const cardRouter = require('./cards');

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().min(2).pattern(regexp),
  }),
}), createUser);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(2).pattern(regexp),
  }),
}), createCard);

module.exports = router;
