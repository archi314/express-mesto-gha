const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { errors, celebrate, Joi } = require('celebrate');

const { PORT = 3000 } = process.env;

const { userRoutes } = require('./routes/users');
const { cardRoutes } = require('./routes/cards');

const { createUser, login } = require('./controllers/users');
const errorHandler = require('./errors/error');
const auth = require('./middlewares/auth');

const {
  ErrorNotFound, /** Ошибка 404. */
} = require('./errors/ErrorNotFound');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^(https?:\/\/)?([\da-z.-]+).([a-z.]{2,6})([/\w.-]*)*\/?$/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(userRoutes);
app.use(cardRoutes);

app.use((req, res) => {
  res.status(ErrorNotFound).send({ message: 'Страница не найлена' });
});

app.use(auth);
app.use(errorHandler);
app.use(errors());

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
