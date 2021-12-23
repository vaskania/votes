const User = require('../model/user');

const signup = async (username, firstName, lastName, password, salt) => {
  const user = await User.create({
    username,
    firstName,
    lastName,
    password,
    salt,
  });
  return user;
};

module.exports = signup;
