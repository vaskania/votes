const userMatch = require('../components/user');

const basicAuth = async (req, res, next) => {
  const id = req.params.id;
  try {
    const authorization = req.headers.authorization;
    if (!authorization || authorization.indexOf('Basic ') === -1) {
      const error = new Error('Missing Authorization Header');
      error.status = 401;
      throw error;
    }
    const encoded = authorization.split(' ')[1];
    const decoded = Buffer.from(encoded, 'base64').toString('ascii');
    const [username, password] = decoded.split(':');

    if (!username || !password) {
      const error = new Error('Username and password must be provided');
      error.status = 403;
      throw error;
    }
    const authUser = await userMatch(id, username, password);

    if (!authUser) {
      const error = new Error('Username or password is incorrect');
      error.status = 401;
      throw error;
    }

    req.authenticatedUser = authUser;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = basicAuth;
