const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');

const router = new express.Router();

// POST /tasks
//
// Create new task
router.post('/tasks', auth, async (req, res) => {
  // Append owner property onto new task object
  // where req.user was created by the auth middleware
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /tasks
//          ?completed={true|false|empty}
//          &limit={#}
//          &skip={#}
//          &sortBy=createdAt:{desc|asc}
router.get('/tasks', auth, async (req, res) => {
  const queryConditions = {
    owner: req.user._id
  };

  if (req.query.completed) {
    queryConditions.completed = req.query.completed === 'true';
  }

  const sort = {};

  if (req.query.sortBy) {
    const [field, direction] = req.query.sortBy.split(':');
    sort[field] = direction === 'asc' ? 1 : -1;
  }

  const options = {
    limit: parseInt(req.query.limit),
    skip: parseInt(req.query.skip),
    sort
  };

  try {
    const tasks = await Task.find(queryConditions, null, options);
    // Alternatively, populate tasks virtually
    // Just make sure you send(req.user.tasks)
    // await req.user
    //   .populate({
    //     path: 'tasks',
    //     match: queryConditions
    //   })
    //   .execPopulate();
    // res.send(req.user.tasks);
    if (!tasks) {
      return res.status(404).send();
    }
    res.send(tasks);
  } catch (e) {
    res.status(500).send();
  }
});

// GET /tasks/:id
//
// Read one task by ID
router.get('/tasks/:id', auth, async (req, res) => {
  const _id = await req.params.id;
  try {
    // Ensure that the task owner matches the queried task
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

// PATCH /tasks/:id
//
// Update task by ID
router.patch('/tasks/:id', auth, async (req, res) => {
  // Ensure valid properties are being updated
  const validProperties = ['description', 'completed'];
  const properties = Object.keys(req.body);
  const isValidProperties = properties.every(property =>
    validProperties.includes(property)
  );

  // Ensure that values for properties are valid
  let isValidValues;
  if (req.body.hasOwnProperty('completed')) {
    isValidValues = typeof req.body.completed === 'boolean';
  }
  if (req.body.hasOwnProperty('description')) {
    isValidValues = req.body.description.length > 0;
  }

  const isValidUpdate = isValidProperties && isValidValues;

  if (!isValidUpdate) {
    return res.status(400).send({ error: 'Invalid update' });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(404).send();
    }

    properties.forEach(property => (task[property] = req.body[property]));
    await task.save();

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

// DELETE /tasks/:id
//
// Delete task by ID
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    // Locate task by its id and its owner's id
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
