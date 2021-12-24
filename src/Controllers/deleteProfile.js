const User = require('../model/user');

const deleteProfile = async (id) => {
  const profileDeleted = await User.findByIdAndUpdate(
    { _id: id },
    { deleted: true },
  );
  return profileDeleted;
};

module.exports = deleteProfile;
