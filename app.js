const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;

const { userRoutes } = require('./routes/users');
const { cardRoutes } = require('./routes/cards');

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
