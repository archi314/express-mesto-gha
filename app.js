const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const { userRoutes } = require('./routes/users');
const { cardRoutes } = require('./routes/cards');

const {
  ErrorNotFound, /** Ошибка 404. */
} = require('./utils/constants');

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133',
  };

  next();
});

app.use(express.json());

app.use(userRoutes);
app.use(cardRoutes);

app.use((req, res) => {
  res.status(ErrorNotFound).send({ message: 'Страница не найлена' });
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
