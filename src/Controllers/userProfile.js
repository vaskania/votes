const User = require('../model/user');

const userProfile = async (id) => {
  const user = await User.find({ _id: id, deleted: false });
  return user;
};

module.exports = userProfile;
