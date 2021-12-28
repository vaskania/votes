const userMatch = require('../components/user');
/*  const jwt = require('jsonwebtoken'); */

const userLogin = async (req, res, next) => {
  const { username, password } = req.body;
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

  req.authenticatedUser = authUser;
  next();
};

module.exports = userLogin;

/* const token = jwt.sign({ id: savedUser._id }, process.env.SECRET, {
  expiresIn: 86400,
});
 */
