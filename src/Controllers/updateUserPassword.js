const User = require('../model/user');

const updateUserPassword = async (id, password, salt) => {
  const user = await User.findByIdAndUpdate(
    { _id: id, deleted: false },
    { password, salt },
  );
  user.save();
  return user;
};

module.exports = updateUserPassword;
