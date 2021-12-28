const express = require('express');
const { connectDB, closeDB } = require('./db/db.js');
const router = require('./routes/usersRoutes');
const logger = require('./log/logger');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

(async () => {
  await connectDB();
})();

app.use(router);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

const server = app.listen(port);

const shutdown = async () => {
  logger.info('Signal received: Gracefully killing application');
  const promises = [closeDB(), server.close()];
  return Promise.all(promises)
    .then(() => {
      logger.info('Application closed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error(error);
    });
};

process.on('SIGINT', shutdown);

process.on('SIGTERM', shutdown);
