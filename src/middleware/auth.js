const jwt = require('jsonwebtoken');
const logger = require('../log/logger');

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET, (err, user) => {
      if (err) {
        logger.error(err);
        return res.status(401).send({ error: { message: 'Invalid token' } });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
};

module.exports = verifyToken;
