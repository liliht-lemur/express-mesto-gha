const User = require('../models/user');
const {
  codeSuccess, codeCreated, codeError, messageError, handleErrors,
} = require('../errors/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(codeSuccess.OK).send(users))
    .catch(() => res.status(codeError.SERVER_ERROR).send({ message: messageError.defaultError }));
};
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(codeCreated.OK).send(user))
    .catch((err) => handleErrors(res, err));
};
const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(codeError.NOT_FOUND).send({ message: messageError.notFoundError });
      } else {
        res.send(user);
      }
    })
    .catch((err) => handleErrors(res, err));
};
const updateMeProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(codeError.NOT_FOUND).send({ message: messageError.notFoundError });
      } else {
        res.send(user);
      }
    })
    .catch((err) => handleErrors(res, err));
};

const updateMeAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(codeError.NOT_FOUND).send({ message: messageError.notFoundError });
      } else {
        res.send(user);
      }
    })
    .catch((err) => handleErrors(res, err));
};

module.exports = {
  getUsers, createUser, getUserById, updateMeProfile, updateMeAvatar,
};
