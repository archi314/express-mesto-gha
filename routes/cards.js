const express = require('express');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const method = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  } throw new Error('URL validation err');
};

const cardRoutes = express.Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRoutes.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(method),
  }),
}), createCard);

cardRoutes.get('/cards', getCards);

cardRoutes.delete(
  '/cards/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24).hex(),
    }),
  }),
  deleteCard,
);

cardRoutes.put(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24).hex(),
    }),
  }),
  likeCard,
);

cardRoutes.delete(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24).hex(),
    }),
  }),
  dislikeCard,
);

module.exports = {
  cardRoutes,
};
