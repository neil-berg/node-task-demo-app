const express = require('express');
const path = require('path');
require('./db/mongoose');
const userRouter = require('./routers/users');
const taskRouter = require('./routers/tasks');

const app = express();

// Automatically parse responses to JSON
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

// Serve static files from the React app in task-manager/client/build
app.use(express.static(path.join(__dirname, '/../client/build')));

// Catchall return React index page for not found pages
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../client/build/index.html'));
});

module.exports = app;
