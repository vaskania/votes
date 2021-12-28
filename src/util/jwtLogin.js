const userMatch = require('../components/user');
const jwt = require('jsonwebtoken');

const userLogin = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res
        .status(403)
        .send({ error: { message: 'Username and password must be provided' } });
    }
    const authUser = await userMatch(username, password);
    if (!authUser) {
      return res
        .status(401)
        .send({ error: { message: 'Username or password is incorrect' } });
    }
    const token = jwt.sign({ id: authUser._id }, process.env.SECRET, {
      expiresIn: 86400,
    });
    return res.status(200).send({ message: 'Logged in successfully', token });
  } catch (error) {
    next(error);
  }
};

module.exports = userLogin;
