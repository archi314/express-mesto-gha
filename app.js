const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors, celebrate, Joi } = require('celebrate');

const { PORT = 3000 } = process.env;

const { createUser, login } = require('./controllers/users');
const { userRoutes } = require('./routes/users');
const { cardRoutes } = require('./routes/cards');

const {
  ErrorNotFound, /** Ошибка 404. */
} = require('./errors/ErrorNotFound');

const app = express();
app.use(cookieParser());

app.use(express.json());

userRoutes.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string()
      .regex(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/)
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

app.use(userRoutes);
app.use(cardRoutes);

app.use((req, res, next) => {
  next(new ErrorNotFound('Страница не найлена'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Ошибка на сервере' : err.message;
  res.status(statusCode).send({ message });
  next();
});

async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb', {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });
    await app.listen(PORT);
    console.log(`Сервер запущен на ${PORT} порту`);
  } catch (err) {
    console.log(err);
  }
}

main();
