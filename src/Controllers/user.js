const User = require('../model/user');

const userExist = async (username) => {
  const user = await User.findOne({ username });
  if (!user) {
    return;
  }
  return user.salt;
};

module.exports = userExist;
