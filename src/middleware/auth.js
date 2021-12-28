const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      return res.status(401).send({ error: { message: 'Invalid token' } });
    }
    req.user = user;
    next();
  });
};

module.exports = verifyToken;
