const hash = require('../util/pbkdf2');
const userExist = require('../Controllers/user');

const basicAuth = async (req, res, next) => {
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
      .send({ message: 'Username and password must provide' });
  }
  const authUser = await userExist(username);
  if (!authUser) {
    return res.status(403).send({ message: 'Forbidden' });
  }
  if (authUser) {
    const match = await hash(password, username);
    if (match) {
      // console.log(match);
      req.authenticatedUser = authUser;
    }
    next();
  }
};

module.exports = basicAuth;
