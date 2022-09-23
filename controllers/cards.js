const Card = require('../models/card');

const ErrorBadRequest = require('../errors/ErrorBadRequest'); /** Ошбика 400. */
const ErrorNotFound = require('../errors/ErrorNotFound'); /** Ошибка 404. */
const ErrorServer = require('../errors/ErrorServer'); /** Ошибка 500. */
const ErrorForbidden = require('../errors/ErrorForbidden'); /** Ошибка 403. */

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (err) {
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const createCard = async (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  try {
    const card = await Card.create({ name, link, owner });
    return res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new ErrorBadRequest('Переданные данные невалидны'));
    }
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const deleteCard = async (req, res, next) => {
  const owner = req.user._id;
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndRemove(cardId);
    if (!card) {
      return next(new ErrorNotFound('Указанной карточки не существует'));
    }
    if (owner !== card.owner.toString()) {
      return next(new ErrorForbidden('Вы не можете удалить чужую карточку'));
    }
    await Card.findByIdAndRemove(cardId);
    return res.send({ message: 'Карточка удалена' });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new ErrorBadRequest('Переданы невалидные данные для удаления карточки'));
    }
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const likeCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return next(new ErrorNotFound('Передан несуществующий id карточки'));
    }
    return res.send(card);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return next(new ErrorBadRequest('Переданы невалидные данные при постановки лайка'));
    }
    return next(new ErrorServer('Произошла ошибка на сервере'));
  }
};

const dislikeCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return next(new ErrorNotFound('Указанная карточка не существует'));
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new ErrorBadRequest('Переданы невалидные данные при постановки лайка'));
    }
    return next(new ErrorServer('Произошла ошибка на сервере'));
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
