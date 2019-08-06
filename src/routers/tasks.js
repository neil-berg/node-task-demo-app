const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');

const router = new express.Router();

// Add task
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

// Read all tasks
router.get('/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id });
    // Alternatively, populate tasks virtually
    // Just make sure you send(req.user.tasks)
    //await req.user.populate('tasks').execPopulate();
    if (!tasks) {
      return res.status(404).send();
    }
    res.send(tasks);
  } catch (e) {
    res.status(500).send();
  }
});

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

// Update task by ID
router.patch('/tasks/:id', auth, async (req, res) => {
  // Ensure valid properties are being updated
  const validUpdates = ['description', 'completed'];
  const updates = Object.keys(req.body);
  const isValidUpdate = updates.every(update => validUpdates.includes(update));

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

    updates.forEach(update => (task[update] = req.body[update]));
    await task.save();

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

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
