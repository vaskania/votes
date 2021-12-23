const User = require('../model/user');

const userProfile = async (id) => {
  const user = await User.findById({ _id: id });
  return user;
};

module.exports = userProfile;
