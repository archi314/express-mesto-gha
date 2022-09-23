const express = require('express');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const method = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  } throw new Error('URL validation err');
};

const userRoutes = express.Router();

const {
  getUsers,
  getUserById,
  getUserInfo,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
} = require('../controllers/users');

const auth = require('../middlewares/auth');

userRoutes.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string()
      .custom(method)
      .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

userRoutes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

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
    avatar: Joi.string().required().custom(method),
  }),
}), updateUserAvatar);

module.exports = {
  userRoutes,
};
