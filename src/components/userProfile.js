const User = require('../model/user');

const userProfile = async (id) => {
  const user = await User.findOne({ _id: id, isDeleted: false });
  return user;
};

module.exports = userProfile;
