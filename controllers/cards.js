const Card = require('../models/card');

const {
  ErrorBadRequest, /** Ошбика 400. */
  ErrorNotFound, /** Ошибка 404. */
  ErrorServer, /** Ошибка 500. */
} = require('../utils/constants');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (err) {
    return res.status(ErrorServer).send({ message: 'Ошибка на сервере' });
  }
};

const createCard = async (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  try {
    const card = await Card.create({ name, link, owner });
    return res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ErrorBadRequest).send({ message: 'Переданные данные невалидны' });
    }
    return res.status(ErrorServer).send({ message: 'Ошибка на сервере' });
  }
};

const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndRemove(cardId);
    if (!card) {
      return res.status(ErrorNotFound).send({ message: 'Указанной карточки не существует' });
    }
    return res.send({ message: 'Карточка удалена' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res
        .status(ErrorBadRequest)
        .send({ message: 'Переданы невалидные данные для удаления карточки' });
    }
    return res.status(ErrorServer).send({ message: 'Ошибка на сервере' });
  }
};

const likeCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res
        .status(ErrorNotFound)
        .send({ message: 'Передан несуществующий id карточки' });
    }
    return res.send(card);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res
        .status(ErrorBadRequest)
        .send({ message: 'Переданы невалидные данные при постановки лайка' });
    }
    return res
      .status(ErrorServer)
      .send({ message: 'Произошла ошибка на сервере' });
  }
};

const dislikeCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res.status(ErrorNotFound).send({ message: 'Указанная карточка не существует' });
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res
        .status(ErrorBadRequest)
        .send({ message: 'Переданы невалидные данные при постановки лайка' });
    }
    return res
      .status(ErrorServer)
      .send({ message: 'Произошла ошибка на сервере' });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
