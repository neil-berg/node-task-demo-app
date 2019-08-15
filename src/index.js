const app = require('./app');

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is up on port:${port}`);
});

// const jwt = require('jsonwebtoken');

// const myFunction = async () => {
//   const token = jwt.sign({ _id: 'abc123' }, 'secretpass', {
//     expiresIn: '7 days'
//   });
//   const data = jwt.verify(token, 'secretpass');
//   console.log(data);
// };

// myFunction();

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
