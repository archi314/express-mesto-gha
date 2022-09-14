const User = require('../models/user');

const {
  ErrorBadRequest, /** Ошбика 400. */
  ErrorNotFound, /** Ошибка 404. */
  ErrorServer, /** Ошибка 500. */
} = require('../utils/constants');

const createUser = async (req, res) => {
  try {
    const user = await new User(req.body).save();
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(ErrorBadRequest).send({ message: 'Переданы невалидные данные' });
    }
    return res.status(ErrorServer).send({ message: 'Ошибка на сервере' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return res.status(ErrorServer).send({ message: 'Ошибка на сервере' });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);

    if (user) {
      return res.send(user);
    }
    return res
      .status(ErrorNotFound)
      .send({ message: 'Указанный пользователь не найден' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res
        .status(ErrorBadRequest)
        .send({ message: 'Переданы невалидные данные' });
    }
    return res.status(ErrorServer).send({ message: 'Ошибка на сервере' });
  }
};

const updateUserProfile = async (req, res) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(
      owner,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res
        .status(ErrorNotFound)
        .send({ message: 'Указанный ваемый пользователь не найден' });
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ErrorBadRequest).send({ message: 'Переданы невалидные данные' });
    }
    return res.status(ErrorServer).send({ message: 'Ошибка на сервере' });
  }
};

const updateUserAvatar = async (req, res) => {
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res
        .status(ErrorNotFound)
        .send({ message: 'Указанный пользователь не найден' });
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res
        .status(ErrorBadRequest)
        .send({ message: 'Переданы невалидные данные' });
    }
    return res.status(ErrorServer).send({ message: 'Ошибка на сервере' });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
};
