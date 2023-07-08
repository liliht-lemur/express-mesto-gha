const usersRouter = require('express').Router();

const {
  getUsers, createUser, getUserById, updateMeProfile, updateMeAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.post('/', createUser);
usersRouter.get('/:userId', getUserById);
usersRouter.patch('/me', updateMeProfile);
usersRouter.patch('/me/avatar', updateMeAvatar);

module.exports = usersRouter;
