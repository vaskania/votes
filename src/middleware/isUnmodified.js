const userProfile = require('../components/userProfile');

const isUnmodified = async (req, res, next) => {
  try {
    const user = await userProfile(req.params.id);
    if (user.message) {
      return res.status(404).send({ error: { messages: 'Invalid user Id' } });
    }
    const lastModified = new Date(user.updatedAt);
    const reqHeaderDate = new Date(req.headers['if-unmodified-since']);
    if (reqHeaderDate === lastModified) {
      return res.status(412).send({ error: { message: 'Cannot modify data' } });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isUnmodified;
