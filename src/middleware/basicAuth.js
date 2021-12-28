const userMatch = require('../components/user');

const basicAuth = async (req, res, next) => {
  const id = req.params.id;
  try {
    const authorization = req.headers.authorization;
    if (!authorization || authorization.indexOf('Basic ') === -1) {
      return res
        .status(401)
        .send({ error: { message: 'Missing Authorization Header' } });
    }
    const encoded = authorization.split(' ')[1];
    const decoded = Buffer.from(encoded, 'base64').toString('ascii');
    const [username, password] = decoded.split(':');

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

    req.authenticatedUser = authUser;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = basicAuth;
