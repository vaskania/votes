const userProfile = require('../components/userProfile');

const userHeader = async (req, res, next) => {
  try {
    const { updatedAt } = await userProfile(req.params.id);
    const lastModified = new Date(updatedAt);
    const reqHeaderDate = new Date(req.headers['if-unmodified-since']);
    if (reqHeaderDate !== lastModified) {
      const error = new Error('Cannot modify data');
      error.status = 412;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = userHeader;
