const express = require('express');
const { celebrate, Joi } = require('celebrate');

const userRoutes = express.Router();

const auth = require('../middlewares/auth');

const {
  getUsers,
  getUserById,
  getUserInfo,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

userRoutes.use(auth);

userRoutes.get('/users', getUsers);
userRoutes.get('/users/me', getUserInfo);

userRoutes.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUserById);

userRoutes.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserProfile);

userRoutes.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/),
  }),
}), updateUserAvatar);

module.exports = {
  userRoutes,
};
