const User = require('../model/user');

const userProfile = async (id) => {
  try {
    const user = await User.findOne({ _id: id, isDeleted: false });
    return user;
  } catch (error) {
    return error;
  }
};

module.exports = userProfile;
