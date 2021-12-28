const express = require('express');
const bodyParser = require('body-parser');
const signup = require('../components/signUp');
const updateUserProfile = require('../components/updateUserProfile');
const updateUserPassword = require('../components/updateUserPassword');
const userProfile = require('../components/userProfile');
const usersList = require('../components/usersList');
const deleteProfile = require('../components/deleteProfile');
const basicAuth = require('../middleware/basicAuth');
const hash = require('../util/pbkdf2');
const isUnmodified = require('../middleware/isUnmodified');

const logger = require('../log/logger');

const router = express.Router();
router.use(bodyParser.json());

// Register User

router.post('/user/register', async (req, res, next) => {
  const { username, password: pwd, firstName, lastName } = req.body;

  try {
    if (!username || typeof username !== 'string' || username.length < 5) {
      const error = new Error('Invalid Username');
      error.status = 400;
      throw error;
    }

    if (!pwd || typeof pwd !== 'string') {
      const error = new Error('Invalid Password');
      error.status = 400;
      throw error;
    }

    if (pwd.trim().length < 5) {
      const error = new Error('Password too small, min 5 charachters');
      error.status = 400;
      throw error;
    }

    if (!firstName || typeof firstName !== 'string') {
      const error = new Error('Invalid Firstname');
      error.status = 400;
      throw error;
    }

    if (!lastName || typeof lastName !== 'string') {
      const error = new Error('Invalid Lastname');
      error.status = 400;
      throw error;
    }

    const { salt, password } = await hash(pwd);

    await signup(username, firstName, lastName, password, salt);
    logger.info(`${username} registered successfuly`);
    return res.status(201).send({
      message: 'New user was created successfully',
    });
  } catch (error) {
    if (error.code === 11000) {
      error.status = 400;
      error.message = 'Username already exists';
    }
    next(error);
  }
});

// Login User

router.post('/user/login', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log(req.body);
  return res.status(200).send({ message: 'Logged in successfully' });
});

// PUT update user Profile by ID

router.put(
  '/user/update-password/:id',
  basicAuth,
  isUnmodified,
  async (req, res, next) => {
    const { password: pwd } = req.body;

    try {
      if (!pwd || typeof pwd !== 'string') {
        const error = new Error('Invalid Password');
        error.status = 400;
        throw error;
      }

      if (pwd.trim().length < 5) {
        const error = new Error('Password too small, min 5 charachters');
        error.status = 400;
        throw error;
      }

      const { salt, password } = await hash(pwd);
      const id = req.params.id;
      await updateUserPassword(id, password, salt);
      return res.status(200).send({ message: 'Password updated successfully' });
    } catch (error) {
      next(error);
    }
  },
);

// PUT update user Profile by ID

router.put(
  '/user/update-profile/:id',
  basicAuth,
  isUnmodified,
  async (req, res, next) => {
    const { firstName, lastName } = req.body;

    try {
      if (typeof firstName !== 'string' || firstName.trim() === '') {
        const error = new Error('Invalid Firstname');
        error.status = 400;
        throw error;
      }

      if (typeof lastName !== 'string' || lastName.trim() === '') {
        const error = new Error('Invalid Lastname');
        error.status = 400;
        throw error;
      }
      const id = req.params.id;
      await updateUserProfile(id, firstName, lastName);
      return res.status(200).send({ message: 'Profile updated successfully' });
    } catch (error) {
      next(error);
    }
  },
);

// GET user by ID

router.get('/user/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await userProfile(id);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    return res.status(200).send({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    next(error);
  }
});

// GET users list

router.get('/users', async (req, res, next) => {
  try {
    const { pageNumber = 0, nPerPage = 3 } = req.query;
    const users = await usersList(+pageNumber, +nPerPage);
    if (users.length === 0) {
      const error = new Error('Not found on this page');
      error.status = 404;
      throw error;
    }
    res.status(200).send(
      users.map((user) => {
        return {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
        };
      }),
    );
  } catch (error) {
    next(error);
  }
});

// Delete User

router.delete('/user/:id', basicAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    await deleteProfile(id);
    return res.status(200).send({
      message: `User with  ID:'${id}' was deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
