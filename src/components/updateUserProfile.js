const User = require('../model/user');

const updateUserProfile = async (id, firstName, lastName) => {
  const user = await User.findOneAndUpdate(
    { _id: id, isDeleted: false, role: 'admin' },
    { firstName, lastName },
  );
  if (user) {
    user.save();
    return user;
  }
};

module.exports = updateUserProfile;
