const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(
  connectionURL,
  {
    useNewUrlParser: true
  },
  (error, client) => {
    if (error) {
      return console.log('Unable to connect to DB');
    }

    const db = client.db(databaseName);

    // Insert one document into the Users collection
    // db.collection('users').insertOne(
    //   {
    //     _id: id,
    //     name: 'Elliott',
    //     age: 25
    //   },
    //   (error, result) => {
    //     if (error) {
    //       return console.log('Unable to insert user');
    //     }
    //     console.log(result.ops);
    //   }
    // );

    //Insert many documents into Users collection
    // db.collection('users').insertMany(
    //   [
    //     {
    //       name: 'Erica',
    //       age: 33
    //     },
    //     {
    //       name: 'Miriam',
    //       age: 34
    //     }
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log('Unable to insert array of documents');
    //     }
    //     console.log(result.ops);
    //   }
    // );

    // Insert three documents to a new tasks collection
    // db.collection('tasks').insertMany(
    //   [
    //     {
    //       description: 'Grocery shopping',
    //       completed: false
    //     },
    //     {
    //       description: 'Udemy course',
    //       completed: false
    //     },
    //     {
    //       description: 'Eat breakfast',
    //       completed: true
    //     }
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log('Error inserting documents');
    //     }
    //     console.log(result.ops);
    //   }
    // );

    // **********
    // READ/FIND a document based on a field
    // **********
    // db.collection('users').findOne(
    //   {
    //     _id: new ObjectID('5d3e03c5eac23b8295070f1d')
    //   },
    //   (error, user) => {
    //     if (error) {
    //       return console.log('Unable to fetch');
    //     }
    //     console.log(user);
    //   }
    // );

    // db.collection('users')
    //   .find({
    //     age: 33
    //   })
    //   .toArray((error, users) => {
    //     console.log(users);
    //   });

    // db.collection('users')
    //   .find({ age: 33 })
    //   .count((error, count) => {
    //     if (error) return console.log('Error');
    //     console.log(count);
    //   });

    // db.collection('tasks').findOne(
    //   { _id: new ObjectID('5d3e056037348182c7d79535') },
    //   (error, task) => {
    //     if (error) return console.log('Error finding tasks');
    //     console.log(task);
    //   }
    // );

    // db.collection('tasks')
    //   .find({ completed: false })
    //   .toArray((error, tasks) => {
    //     if (error) return console.log('Error finding tasks');
    //     console.log(tasks);
    //   });

    // ********
    // UPDATING
    // ********
    // db.collection('users')
    //   .updateOne(
    //     { _id: new ObjectID('5d3cc165ee2800800b762a2a') },
    //     {
    //       $set: {
    //         name: 'Bergerrr'
    //       },
    //       $inc: {
    //         age: 1
    //       }
    //     }
    //   )
    //   .then(result => console.log(result))
    //   .catch(error => console.log(error));

    // Updating many
    db.collection('tasks')
      .updateMany(
        { completed: false },
        {
          $set: {
            completed: true
          }
        }
      )
      .then(result => console.log(result))
      .catch(error => console.log(error));

    // ******************
    // DELETING DOCUMENTS
    // ******************
    // db.collection('users')
    //   .deleteOne({ name: 'Elliott' })
    //   .then(result => console.log(result))
    //   .catch(error => console.log(error));

    // db.collection('users')
    //   .deleteMany({ name: 'Miriam' })
    //   .then(result => console.log(result))
    //   .catch(error => console.log(error));

    db.collection('tasks')
      .deleteOne({ description: 'Grocery shopping' })
      .then(result => console.log(result));
  }
);
