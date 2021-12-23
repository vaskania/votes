const User = require('../model/user');
const hash = require('../util/pbkdf2');

const authenticate = async (username, password) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return;
    }
    const { salt } = user;
    const loginHashed = await hash(password, salt);

    if (loginHashed.password === user.password) {
      return user;
    }
  } catch (error) {
    return error;
  }
};

module.exports = authenticate;
