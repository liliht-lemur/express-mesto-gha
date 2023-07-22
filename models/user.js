const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnAuthorizedError = require('../errors/UnAuthorizedError');
const {
  messageError,
} = require('../errors/errors');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minLength: 2,
    maxLength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Некорректный URL',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    select: false,
  },
});
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnAuthorizedError(messageError.unauthorized));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnAuthorizedError(messageError.unauthorized));
          }

          return user;
        });
    });
};
module.exports = mongoose.model('user', userSchema);
