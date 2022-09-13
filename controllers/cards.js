const Card = require('../models/card');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    res.status(500).send({ message: 'Ошибка на сервере', ...err });
  }
};

const createCard = async (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  try {
    const card = await Card.create({ name, link, owner });
    return res.status(200).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданные данные невалидны', ...err });
    }
    return res.status(500).send({ message: 'Ошибка на сервере', ...err });
  }
};

const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndRemove(cardId);
    if (!card) {
      res.status(404).send({ message: 'Указанной карточки не существует' });
    }
    return res.status(200).send({ message: 'Карточка удалена' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res
        .status(400)
        .send({ message: 'Переданы невалидные данные для удаления карточки' });
    }
    return res.status(500).send({ message: 'Ошибка на сервере', ...err });
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
        .status(404)
        .send({ message: 'Передан несуществующий id карточки' });
    }
    return res.status(200).send(card);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res
        .status(400)
        .send({ message: 'Переданы невалидные данные при постановки лайка' });
    }
    return res
      .status(500)
      .send({ message: 'Произошла ошибка на сервере', ...err });
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
      return res.status(404).send({ message: 'Указанная карточка не существует' });
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res
        .status(400)
        .send({ message: 'Переданы невалидные данные при постановки лайка' });
    }
    return res
      .status(500)
      .send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
