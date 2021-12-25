const express = require('express');
const bodyParser = require('body-parser');
const signup = require('../Controllers/signUp');
const updateUserProfile = require('../Controllers/updateUserProfile');
const updateUserPassword = require('../Controllers/updateUserPassword');
const userProfile = require('../Controllers/userProfile');
const usersList = require('../Controllers/usersList');
const deleteProfile = require('../Controllers/deleteProfile');
const basicAuth = require('../middleware/basicAuth');
const hash = require('../util/pbkdf2');

const logger = require('../log/logger');

const router = express.Router();
router.use(bodyParser.json());

// Signup User

router.post('/user/register', async (req, res) => {
  const { username, password: pwd, firstName, lastName } = req.body;

  if (!username || typeof username !== 'string' || username.length < 5) {
    return res.status(409).send({ error: 'Invalid Username' });
  }

  if (!pwd || typeof pwd !== 'string') {
    return res.status(409).send({ error: 'Invalid Password' });
  }

  if (pwd.trim().length < 5) {
    return res
      .status(409)
      .send({ error: 'Password too small, min 5 charachters' });
  }

  if (!firstName || typeof firstName !== 'string') {
    return res.status(409).send({ error: 'Invalid Firstname' });
  }

  if (!lastName || typeof lastName !== 'string') {
    return res.status(409).send({ error: 'Invalid Lastname' });
  }

  const { salt, password } = await hash(pwd);

  try {
    await signup(username, firstName, lastName, password, salt);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).send({ error: 'Username already exists' });
    }
    throw error;
  }
  logger.info(`${username} registered successfuly`);
  return res.status(201).send({ message: 'New user was created successfully' });
});

// Signin User

router.post('/user/login', basicAuth, async (req, res) => {
  return res.status(200).send({ message: 'Logged in successfully' });
});

// PUT update user Profile by ID

router.put('/user/update-password/:id', basicAuth, async (req, res) => {
  const { password: pwd } = req.body;

  if (!pwd || typeof pwd !== 'string') {
    return res.status(409).send({ error: 'Invalid Password' });
  }

  if (pwd.trim().length < 5) {
    return res
      .status(409)
      .send({ error: 'Password too small, min 5 charachters' });
  }

  const { salt, password } = await hash(pwd);

  try {
    const id = req.params.id;
    await updateUserPassword(id, password, salt);
    return res.status(200).send({ message: 'Password updated successfully' });
  } catch (error) {
    return res.status(404).send({ error: 'Invalid user ID' });
  }
});

// PUT update user Profile by ID

router.put('/user/update-profile/:id', basicAuth, async (req, res) => {
  const { firstName, lastName } = req.body;
  if (typeof firstName !== 'string' || firstName.trim() === '') {
    return res.status(409).send({ error: 'Invalid Firsname' });
  }

  if (typeof lastName !== 'string' || lastName.trim() === '') {
    return res.status(409).send({ error: 'Invalid Lastname' });
  }

  try {
    const id = req.params.id;
    await updateUserProfile(id, firstName, lastName);
    res.status(200).send({ message: 'Profile updated successfully' });
  } catch (error) {
    return res.status(404).send({ error: 'User not found' });
  }
});

// GET user by ID

router.get('/user/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userProfile(id);
    if (user.length !== 0) {
      res.status(200).send({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    } else {
      return res.status(404).send({ error: 'User not found' });
    }
  } catch (error) {
    return res.status(404).send({ error: 'User not found' });
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
    return res.status(404).send({ error: 'Users not found' });
  } catch (error) {
    return res.status(404).send({ error: "Cann't get data" });
  }
});

// Delete User

router.delete('/user/:id', basicAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const user = await deleteProfile(id);
    res.status(200).send({
      message: `${user.username} with  ID:'${id}' was deleted successfully`,
    });
  } catch (error) {
    return res.status(404).send({ error: 'User not found' });
  }
});

module.exports = router;
