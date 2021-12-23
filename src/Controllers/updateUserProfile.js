const User = require('../model/user');

const updateUserProfile = async (id, firstName, lastName) => {
  const user = await User.findByIdAndUpdate(
    { _id: id },
    { firstName, lastName },
  );
  user.save();
  return user;
};

module.exports = updateUserProfile;
