const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  codeSuccess, codeCreated, messageError,
} = require('../errors/errors');
const NotFoundError = require('../errors/NotFoundError');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(codeSuccess.OK).send(users))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(codeCreated.OK).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(messageError.notFoundError);
      } else {
        res.send(user);
      }
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(messageError.notFoundError);
      } else {
        res.send(user);
      }
    })
    .catch(next);
};

const updateMeProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(messageError.notFoundError);
      } else {
        res.send(user);
      }
    })
    .catch(next);
};

const updateMeAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(messageError.notFoundError);
      } else {
        res.send(user);
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUsers, createUser, getUserById, updateMeProfile, updateMeAvatar, login, getCurrentUser,
};
