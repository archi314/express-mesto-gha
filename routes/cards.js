const express = require('express');

const cardRoutes = express.Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRoutes.get('/cards', express.json(), getCards);
cardRoutes.post('/cards', express.json(), createCard);
cardRoutes.delete('/cards/:cardId', express.json(), deleteCard);
cardRoutes.put('/cards/:cardId/likes', express.json(), likeCard);
cardRoutes.delete('/cards/:cardId/likes', express.json(), dislikeCard);

module.exports = {
  cardRoutes,
};
