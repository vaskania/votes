const userProfile = require('../components/userProfile');

const isUnmodified = async (req, res, next) => {
  try {
    const { updatedAt } = await userProfile(req.params.id);
    const lastModified = new Date(updatedAt);
    const reqHeaderDate = new Date(req.headers['if-unmodified-since']);
    if (reqHeaderDate !== lastModified) {
      res.status(412).send({ error: { message: 'Cannot modify data' } });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isUnmodified;
