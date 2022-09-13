const User = require('../models/user');

const createUser = async (req, res) => {
  try {
    const user = await new User(req.body).save();
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы невалидные данные', ...err });
    }
    res.status(500).send({ message: 'Ошибка на сервере', ...err });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ message: 'Ошибка на сервере', ...err });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);

    if (user) {
      return res.status(200).send(user);
    }
    return res
      .status(404)
      .send({ message: 'Указанный пользователь не найден' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res
        .status(400)
        .send({ message: 'Переданы невалидные данные', ...err });
    }
    return res.status(500).send({ message: 'Ошибка на сервере', ...err });
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
        .status(404)
        .send({ message: 'Указанный ваемый пользователь не найден' });
    }
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы невалидные данные' });
    }
    return res.status(500).send({ message: 'Ошибка на сервере', ...err });
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
        .status(404)
        .send({ message: 'Указанный пользователь не найден' });
    }
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res
        .status(400)
        .send({ message: 'Переданы невалидные данные', ...err });
    }
    return res.status(500).send({ message: 'Ошибка на сервере', ...err });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
};
