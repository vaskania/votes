const User = require('../model/user');

const deleteProfile = async (id) => {
  const profileDeleted = await User.softDelete({ _id: id });
  return profileDeleted;
};

module.exports = deleteProfile;
