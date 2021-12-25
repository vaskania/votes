const User = require('../model/user');

const usersList = async (pageNumber, nPerPage) => {
  const users = await User.find({ isDeleted: false })
    .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
    .limit(nPerPage);
  return users;
};

module.exports = usersList;
