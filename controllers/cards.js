const Card = require('../models/card');
const {
  codeSuccess, codeCreated, codeError, messageSuccess, messageError, handleErrors,
} = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(codeSuccess.OK).send(cards))
    .catch(() => res.status(codeError.SERVER_ERROR).send({ message: messageError.defaultError }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(codeCreated.OK).send(card))
    .catch((err) => handleErrors(res, err));
};

const deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(codeError.NOT_FOUND).send({ message: messageError.notFoundError });
      } else {
        res.send({ message: messageSuccess.okMessage });
      }
    })
    .catch((err) => handleErrors(res, err));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(codeError.NOT_FOUND).send({ message: messageError.notFoundError });
      } else {
        res.send(card);
      }
    })
    .catch((err) => handleErrors(res, err));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(codeError.NOT_FOUND).send({ message: messageError.notFoundError });
      } else {
        res.send(card);
      }
    })
    .catch((err) => handleErrors(res, err));
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
