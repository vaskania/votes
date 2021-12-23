const express = require('express');
const bodyParser = require('body-parser');
const signup = require('../Controllers/signUp');
const updateUserProfile = require('../Controllers/updateUserProfile');
const updateUserPassword = require('../Controllers/updateUserPassword');
const userProfile = require('../Controllers/userProfile');
const usersList = require('../Controllers/usersList');
const basicAuth = require('../middleware/basicAuth');
const hash = require('../util/pbkdf2');

const logger = require('../log/logger');

const router = express.Router();
router.use(bodyParser.json());

// Signup User

router.post('/user/signup', async (req, res) => {
  const { username, password: pwd, firstName, lastName } = req.body;

  if (!username || typeof username !== 'string' || username.length < 5) {
    return res.json({ status: 'error', error: 'Invalid Username' });
  }

  if (!pwd || typeof pwd !== 'string') {
    return res.json({ status: 'error', error: 'Invalid Password' });
  }

  if (pwd.trim().length < 5) {
    return res.json({
      status: 'error',
      error: 'Password too small, min 5 charachters',
    });
  }

  if (!firstName || typeof firstName !== 'string') {
    return res.json({ status: 'error', error: 'Invalid Name' });
  }

  if (!lastName || typeof lastName !== 'string') {
    return res.json({ status: 'error', error: 'Invalid Lastname' });
  }

  const { salt, password } = await hash(pwd);

  try {
    await signup(username, firstName, lastName, password, salt);
  } catch (error) {
    if (error.code === 11000) {
      return res.json({
        status: 'error',
        error: 'Username already registered',
      });
    }
    throw error;
  }
  logger.info(`${username} registered successfuly`);
  res.json({ status: 201, message: 'New user was created successfully' });
});

// Signin User

router.post('/user/signin', basicAuth, async (req, res) => {
  res.send({ status: 'Logged in successfully' });
});

// POST updete user Profile by ID

router.post('/user/:id/update-password', basicAuth, async (req, res) => {
  const { password: pwd } = req.body;

  if (!pwd || typeof pwd !== 'string') {
    return res.json({ status: 'error', error: 'Invalid Password' });
  }

  if (pwd.trim().length < 5) {
    return res.json({
      status: 'error',
      error: 'Password too small, min 5 charachters',
    });
  }

  const { salt, password } = await hash(pwd);

  try {
    const id = req.params.id;
    await updateUserPassword(id, password, salt);
    res.send({
      status: 'Password updated successfully',
    });
  } catch (error) {
    return res.json({
      status: 404,
      error: 'Invalid user ID',
    });
  }
});

// POST updete user Profile by ID

router.post('/user/:id/update-profile', basicAuth, async (req, res) => {
  const { firstName, lastName } = req.body;
  if (typeof firstName !== 'string' || firstName.trim() === '') {
    return res.json({ status: 'error', error: 'Invalid Name' });
  }

  if (typeof lastName !== 'string' || lastName.trim() === '') {
    return res.json({ status: 'error', error: 'Invalid Lastname' });
  }

  try {
    const id = req.params.id;
    await updateUserProfile(id, firstName, lastName);
    res.send({
      status: 'Profile updated successfully',
    });
  } catch (error) {
    return res.json({
      status: 404,
      error: 'The username was not found',
    });
  }
});

// GET user by ID

router.get('/user/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userProfile(id);
    res.json({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    return res.json({
      status: 'error',
      error: 'Invalid user ID',
    });
  }
});

// GET users list

router.get('/users', async (req, res) => {
  try {
    const { pageNumber = 0, nPerPage = 3 } = req.query;
    const users = await usersList(+pageNumber, +nPerPage);
    if (users.length > 0) {
      return res.json(
        users.map((user) => {
          return {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
          };
        }),
      );
    }
    return res.json({ status: 'Users not found' });
  } catch (error) {
    return res.json({
      status: 'error',
      error: "Cann't get data",
    });
  }
});

module.exports = router;
