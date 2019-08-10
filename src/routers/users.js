const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = new express.Router();

// POST /users
//
// Create a new user with JWT
router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    const token = await user.generateAuthToken();
    await user.save();
    // Token is sent back to store login creds on Postman
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

// POST /users/login
//
// Login a user by verifying email/pw combination
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
    //res.send({ user: user.getPublicProfile(), token });
  } catch (error) {
    res.status(400).send();
  }
});

// POST /users/logout
//
// Logout user via JWT token
// Middleware: auth
router.post('/users/logout', auth, async (req, res) => {
  try {
    // Remove the token from this login session from the
    // user array of tokens
    // Recall that req.user is returned from 'auth'
    req.user.tokens = req.user.tokens.filter(
      token => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

// POST /users/logoutAll
//
// Logout user by clearing all of their JWTs
// Middleware: auth
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    // Remove all tokens from the authorized user
    // Recall that req.user is returned from 'auth'
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

// POST /users/me/avatar
//
// Upload profile picture
// Middleware: auth, upload
router.post(
  '/users/me/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// GET /users/me
//
// Read information on a logged-in user
// Middleware: auth
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

// GET /users/:id/avatar
//
// Read information about a user's avatar by user id
router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

// PATCH /users/me
//
// Update information for a logged-in user
// Middleware: auth
router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperator = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperator) {
    return res.status(400).send({ error: 'Invalid updates' });
  }

  try {
    // This method allows for mongoose middle save to be
    // executed before/after the save() command
    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// DELETE /users/me
//
// Remove user from database
// Middleware: auth
router.delete('/users/me', auth, async (req, res) => {
  try {
    // Recall that auth returns req.user object
    // Middleware occurs before remove() to delete tasks
    // with this owner
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

// DELETE /users/me/avatar
//
// Remove avatar for a logged-in user
router.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined;
  try {
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
