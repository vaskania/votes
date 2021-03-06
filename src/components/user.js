const User = require('../model/user');
const hash = require('../util/pbkdf2');

const userMatch = async (username, password, id = null) => {
  let user = null;
  id
    ? (user = await User.findOne({ _id: id, isDeleted: false }))
    : (user = await User.findOne({ username, isDeleted: false }));

  if (!user) {
    return;
  }
  const { salt } = user;
  const checkMatch = await hash(password, salt);

  if (checkMatch.password === user.password && username === user.username) {
    return user;
  }
};

module.exports = userMatch;
