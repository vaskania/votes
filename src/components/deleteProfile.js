const User = require('../model/user');
const findUser = require('../components/user');

const deleteProfile = async (username, password, id) => {
  const user = await findUser(username, password);
  if (!user) {
    return false;
  }
  if (user.role === 'admin') {
    await User.softDelete({ _id: id });
    return { isAdmin: true };
  }
  return { isAdmin: false };
};

module.exports = deleteProfile;
