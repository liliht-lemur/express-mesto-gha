const express = require('express');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const {
  messageError,
} = require('./errors/errors');
const NotFoundError = require('./errors/NotFoundError');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const centralizedErrorHandler = require('./middlewares/errors');
const {
  validationCreateUser,
  validationLogin,
} = require('./middlewares/validations');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());

app.post('/signin', validationLogin, login);
app.post('/signup', validationCreateUser, createUser);
app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);
app.use((req, res, next) => {
  next(new NotFoundError(messageError.notFoundError));
});
app.use(errors()); // обработчик ошибок celebrate
app.use(centralizedErrorHandler); // централизованный обработчик ошибок
app.listen(PORT, () => console.log('Server started'));
