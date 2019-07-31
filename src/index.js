// With Mongoose ------
const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.port || 3000;

// Automatically parse responses to JSON
app.use(express.json());

app.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send();
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send();
  }
});

app.get('/users/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

app.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperator = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperator) {
    return res.status(400).send({ error: 'Invalid updates' });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    if (!tasks) {
      return res.status(404).send();
    }
    res.send(tasks);
  } catch (e) {
    res.status(500).send();
  }
});

app.get('/tasks/:id', async (req, res) => {
  const _id = await req.params.id;
  try {
    const task = await Task.findById(_id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

app.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).send();
  } catch (e) {
    res.status(400).send(e);
  }
});

app.patch('/tasks/:id', async (req, res) => {
  // Ensure valid properties are being updates
  const validUpdates = ['description', 'completed'];
  const updates = Object.keys(req.body);
  const isValidUpdate = updates.every(update => validUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({ error: 'Invalid update' });
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

app.listen(port, () => {
  console.log(`Server is up on port:${port}`);
});

// **************************
// Without Mongoose --------
// **************************
// const express = require('express');
// const { MongoClient, ObjectID } = require('mongodb');

// const app = express();
// const port = process.env.port || 3000;

// // Automatically parse responses to JSON
// app.use(express.json());

// // Initialize the DB connection once
// const connectionURL = 'mongodb://127.0.0.1:27017';
// const databaseName = 'task-manager';

// MongoClient.connect(
//   connectionURL,
//   {
//     useNewUrlParser: true
//   },
//   (error, client) => {
//     if (error) {
//       return console.log('Unable to connect to DB');
//     }

//     app.locals.db = client.db(databaseName);
//     app.listen(port, () => {
//       console.log(`Server running on port ${port}`);
//     });
//   }
// );

// app.post('/users', (req, res) => {
//   const db = req.app.locals.db;
//   const user = req.body;
//   db.collection('users')
//     .insertOne(user)
//     .then(() => res.send(user))
//     .catch(error => res.status(400).send(error));
// });

// app.patch('/users/:id', (req, res) => {
//   const db = req.app.locals.db;
//   const id = new ObjectID(req.params.id);
//   db.collection('users')
//     .updateOne({ _id: id }, { $set: { name: req.body.name } })
//     .then(() => res.send(req.body))
//     .catch(error => res.status(404).send(error));
// });

// app.get('/users/', (req, res) => {
//   const db = req.app.locals.db;
//   db.collection('users')
//     .find({})
//     .toArray((error, users) => {
//       if (users) {
//         res.send(users);
//       } else {
//         res.status(404).send(error);
//       }
//     });
// });

// app.delete('/users/:id', (req, res) => {
//   const db = req.app.locals.db;
//   const id = new ObjectID(req.params.id);
//   db.collection('users')
//     .deleteOne({ _id: id })
//     .then(() => res.send(req.body))
//     .catch(error => res.status(404).send(error));
// });
