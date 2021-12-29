const User = require('../model/user');
const userProfile = require('../components/userProfile');

const deleteProfile = async (id) => {
  const user = await userProfile(id);
  if (!user) {
    return false;
  } else if (user.message) {
    return user;
  }
  const profileDeleted = await User.softDelete({ _id: id, role: 'admin' });
  return profileDeleted;
};

module.exports = deleteProfile;
