const Card = require('../models/card');
const {
  codeSuccess, codeCreated, messageError, messageSuccess,
} = require('../errors/errors');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(codeSuccess.OK).send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(codeCreated.OK).send(card))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(messageError.notFoundError);
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError(messageError.forbiddenMessage);
      } else {
        Card.deleteOne(card)
          .then(() => {
            res.send({ message: messageSuccess.okMessage });
          })
          .catch(next);
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(messageError.notFoundError);
      } else {
        res.send(card);
      }
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(messageError.notFoundError);
      } else {
        res.send(card);
      }
    })
    .catch(next);
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
