const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const {
  codeError, messageError,
} = require('./errors/errors');

const { PORT = 3000 } = process.env;

const app = express();

// mongoose.connect('mongodb://localhost:27017/mestodb');
mongoose.connect('mongodb+srv://liliht:bZSXtshTT3BoiQXR@mestodb.2bfwkjk.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64a98226eb087e92e5e63303',
  };

  next();
});
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('/', (req, res) => res.status(codeError.NOT_FOUND).send({ message: messageError.notFoundError }));

app.listen(PORT, () => console.log('Server started'));
