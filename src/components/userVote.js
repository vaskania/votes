const User = require('../model/user');

const userVote = async (username, id, vote) => {
  const getUserForVote = await User.findOne({ username, isDeleted: false });
  if (!getUserForVote) {
    return;
  }
  const user = await User.findOne({ _id: id, isDeleted: false });
  if (username === user.username) {
    return { isMatched: true };
  }
  const timeNow = new Date();
  const timeDiff = (timeNow - user.lastVotedAt) / (1000 * 60 * 60);
  if (timeDiff < 1) {
    return { canVote: false };
  }

  if (vote === 'add' || vote === 'subtract') {
    user.votedUsers.find((el) => {
      if (el.username === username) {
        const error = new Error("Cann't vote same user");
        error.status = 403;
        return error;
      }
      return 'hello';
    });
    getUserForVote.save();
    return;
  }
  switch (vote) {
    case 'add':
      getUserForVote.votes_sum += 1;
      break;
    case 'subtract':
      getUserForVote.votes_sum -= 1;
      break;
    case 'changeVote':
      getUserForVote.votes_sum *= -1;
      break;
    case 'withdraw':
      getUserForVote.votes_sum = 0;
      break;
  }

  getUserForVote.save();
  user.lastVotedAt = timeNow;
  user.votedUsers.push({ username, vote: 1 });
  user.save();
};

module.exports = userVote;
