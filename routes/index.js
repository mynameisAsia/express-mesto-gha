const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/users');
const { regexp } = require('../constants/regexp');
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFound = require('../errors/NotFound');

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

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

router.use('*', () => {
  throw new NotFound('Путь не найден');
});

module.exports = router;
