const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/users');
const taskRouter = require('./routers/tasks');

const app = express();

// Automatically parse responses to JSON
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
