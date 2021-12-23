const User = require('../model/user');
const hash = require('../util/pbkdf2');

const userMatch = async (id = null, username, password) => {
  let user = null;
  try {
    id
      ? (user = await User.findOne({ _id: id }))
      : (user = await User.findOne({ username }));

    if (!user) {
      return;
    }
    const { salt } = user;
    const checkMatch = await hash(password, salt);

    if (checkMatch.password === user.password && username === user.username) {
      return user;
    }
  } catch (error) {
    return error;
  }
};

module.exports = userMatch;
