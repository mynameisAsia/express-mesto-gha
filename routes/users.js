const userRouter = require('express').Router();
const {
  getUsers,
  getUser,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUser);
userRouter.get('/me', getCurrentUser);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;
