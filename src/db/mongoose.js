const mongoose = require('mongoose');

// Connect mongoose to the MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true
});
