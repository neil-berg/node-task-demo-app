const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
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
    unique: true,
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
        throw new Error('Password cannot contain the word password');
      }
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
    }
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

// Instance methods (methods)
userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'benny');
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  // Remove password and tokens from the user profile
  // that is sent back in the login response
  // Note: res.send() calls JSON.stringify beind the scenes
  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

// Model methods (statics)
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  // User's email does not exist
  if (!user) {
    throw new Error('Unable to login');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  // Mismatch between existing email and password combo
  if (!isMatch) {
    throw new Error('Unable to login');
  }

  return user;
};

// Hash passwords before saving user password (new or existing)
userSchema.pre('save', async function(next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
