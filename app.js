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

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();
const allowedCors = [
  'https://liliht.nomoredomains.sbs',
  'http://liliht.nomoredomains.sbs',
  'localhost:3000',
];

app.use((req, res, next) => {
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];

  // if (allowedCors.includes(origin)) {
  //   res.header('Access-Control-Allow-Origin', origin);
  // }
  res.header('Access-Control-Allow-Origin', '*');

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
});

mongoose.connect(DB_URL);

app.use(bodyParser.json());

app.use(requestLogger);
app.post('/signin', validationLogin, login);
app.post('/signup', validationCreateUser, createUser);
app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);
app.use((req, res, next) => {
  next(new NotFoundError(messageError.notFoundError));
});
app.use(errorLogger);
app.use(errors()); // обработчик ошибок celebrate
app.use(centralizedErrorHandler); // централизованный обработчик ошибок
app.listen(PORT, () => console.log('Server started'));
