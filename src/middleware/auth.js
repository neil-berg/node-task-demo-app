const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'benny');
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token
    });
    if (!user) {
      throw new Error();
    }

    // Adding on token and user properties to the request object
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

module.exports = auth;
