const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    required: [true, 'Поле "name" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },

  about: {
    type: String,
    default: 'Исследователь',
    required: [true, 'Поле "about" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "about" - 2'],
    maxlength: [30, 'Максимальная длина поля "about" - 30'],
  },

  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    required: [true, 'Поле "avatar" должно быть заполнено'],
    validate: {
      validator(v) {
        return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]+\.[a-zA-Z0-9()]+([-a-zA-Z0-9()@:%_\\+.~#?&/=#]*)/.test(v);
      },
      message: 'Невалидная ссылка',
    },
  },

  email: {
    type: String,
    unique: true,
    required: [true, 'Поле "email" должно быть заполнено'],
    validate: {
      validator: validator.isEmail,
      message: 'Неверно заполнен email',
    },
  },

  password: {
    type: String,
    select: false,
    required: [true, 'Поле "password" должно быть заполнено'],
  },
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('user', userSchema);
