const User = require('../model/user');

const updateUserPassword = async (id, password, salt) => {
  const user = await User.findOneAndUpdate(
    { _id: id, isDeleted: false, role: 'admin' },
    { password, salt },
  );

  if (user) {
    user.save();
    return user;
  }
};

module.exports = updateUserPassword;
