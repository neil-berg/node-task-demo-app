const mongoose = require('mongoose');
const validator = require('validator');

// Connect mongoose to the MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
  useNewUrlParser: true,
  useCreateIndex: true
});

// Define models and schema
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
    }
  }
});

const Task = mongoose.model('Task', {
  description: {
    type: String,
    trim: true,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

// // Create and add documents
// const me = new User({
//   name: 'Erica',
//   email: 'erica@erica.dev',
//   password: 'passwerdd1234'
// });

// me.save()
//   .then(result => console.log(result))
//   .catch(error => console.log(error));

const task = new Task({
  description: 'Get groceries'
});

task
  .save()
  .then(result => console.log(result))
  .catch(error => console.log(error));
