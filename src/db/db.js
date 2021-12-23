const mongoose = require('mongoose');
const logger = require('../log/logger');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    logger.info('Connected to db');
  } catch (error) {
    logger.error("Couldn't connect to database");
    process.exit(1);
  }
};

const closeDB = async () => {
  logger.info('DB closed');
  await mongoose.connection.close();
};

module.exports = { connectDB, closeDB };
