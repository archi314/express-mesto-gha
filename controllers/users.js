const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ErrorBadRequest = require('../errors/ErrorBadRequest'); /** Ошбика 400. */
const ErrorNotFound = require('../errors/ErrorNotFound'); /** Ошибка 404. */
const ErrorServer = require('../errors/ErrorServer'); /** Ошибка 500. */
const ErrorConflict = require('../errors/ErrorConflict'); /** Ошибка 409. */
const ErrorUnauthorized = require('../errors/ErrorUnauthorized'); /** Ошибка 401. */

const createUser = async (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new ErrorBadRequest('Переданы невалидные данные'));
    }
    if (err.code === 11000) {
      return next(new ErrorConflict('Пользователь с указанным email не найден'));
    }
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorNotFound('Указанный пользователь не найден'));
    }
    return res.send(user);
  } catch (err) {
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const getUserById = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (user) {
      return res.send(user);
    }
    return next(new ErrorNotFound('Указанный пользователь не найден'));
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return next(new ErrorBadRequest('Переданы невалидные данные'));
    }
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const updateUserProfile = async (req, res, next) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(
      owner,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(new ErrorNotFound('Указанный пользователь не найден'));
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new ErrorBadRequest('Переданы невалидные данные'));
    }
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const updateUserAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(new ErrorNotFound('Указанный пользователь не найден'));
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new ErrorBadRequest('Переданы невалидные данные'));
    }
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorUnauthorized('Неверно ведена почта или пароль'));
    }
    const userValid = await bcrypt.compare(password, user.password);
    if (!userValid) {
      return next(new ErrorUnauthorized('Неверно ведена почта или пароль'));
    }

    const token = jwt.sign({
      _id: user._id,
    }, 'SECRET');
    res.cookie('jwt', token, {
      maxAge: 3600000,
      httpOnly: true,
      sameSite: true,
    });
    return res.status(200).send(user.toJSON());
  } catch (error) {
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getUserInfo,
  updateUserProfile,
  updateUserAvatar,
  login,
};
