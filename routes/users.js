const usersRouter = require('express').Router();

const {
  getUsers, getUserById, updateMeProfile, updateMeAvatar, getCurrentUser,
} = require('../controllers/users');
const {
  validationUserId, validationUpdateUser, validationUpdateAvatar,
} = require('../middlewares/validations');

usersRouter.get('/', getUsers);
usersRouter.get('/me', getCurrentUser);
usersRouter.get('/:userId', validationUserId, getUserById);
usersRouter.patch('/me', validationUpdateUser, updateMeProfile);
usersRouter.patch('/me/avatar', validationUpdateAvatar, updateMeAvatar);

module.exports = usersRouter;
