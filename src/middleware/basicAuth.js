const userMatch = require('../Controllers/user');

const basicAuth = async (req, res, next) => {
  const id = req.params.id;

  const authorization = req.headers.authorization;
  if (!authorization || authorization.indexOf('Basic ') === -1) {
    return res.status(401).json({ message: 'Missing Authorization Header' });
  }
  const encoded = authorization.split(' ')[1];
  const decoded = Buffer.from(encoded, 'base64').toString('ascii');
  const [username, password] = decoded.split(':');

  if (!username || !password) {
    return res
      .status(403)
      .send({ message: 'Username and password must be provided.' });
  }
  const authUser = await userMatch(id, username, password);

  if (!authUser) {
    return res
      .status(403)
      .send({ message: 'Username or password is incorrect' });
  }

  req.authenticatedUser = authUser;

  next();
};

module.exports = basicAuth;
