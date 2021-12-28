const userMatch = require('../components/user');
const jwt = require('jsonwebtoken');

const userLogin = async (req, res, next) => {
  const { id, username, password } = req.body;

  try {
    if (!username || !password) {
      return res
        .status(403)
        .send({ error: { message: 'Username and password must be provided' } });
    }
    const authUser = await userMatch(id, username, password);
    if (!authUser) {
      return res
        .status(401)
        .send({ error: { message: 'Username or password is incorrect' } });
    }
    const token = jwt.sign({ id: authUser._id }, process.env.SECRET, {
      expiresIn: 86400,
    });
    return token;
  } catch (error) {
    next(error);
  }
};

module.exports = userLogin;
