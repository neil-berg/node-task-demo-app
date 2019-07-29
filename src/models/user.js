const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    default: 0,
    validate: value => {
      if (value < 0) {
        throw new Error('Age must be a positive number');
      }
    }
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: email => {
      if (!validator.isEmail(email)) {
        throw new Error('Invalid email');
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 7,
    validate: password => {
      if (/password/i.test(password)) {
        throw new Error('Password cannot contain the word password ');
      }
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
    }
  }
});

module.exports = User;
