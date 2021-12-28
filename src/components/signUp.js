const User = require('../model/user');

const signup = async (username, firstName, lastName, password, salt) => {
  const newUser = await new User({
    username,
    firstName,
    lastName,
    password,
    salt,
  });

  const savedUser = await newUser.save();

  return savedUser;
};

module.exports = signup;
