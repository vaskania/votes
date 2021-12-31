const mongoose = require('mongoose');
const { softDeletePlugin } = require('soft-delete-plugin-mongoose');

const { Schema } = mongoose;
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      min: 4,
      max: 45,
    },
    firstName: {
      type: String,
      min: 2,
      max: 20,
    },
    lastName: {
      type: String,
      min: 2,
      max: 20,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 1000,
    },
    salt: {
      type: String,
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'moderator', 'admin'],
    },
    votes_sum: {
      type: Number,
      default: 0,
    },
    lastVotedAt: {
      type: Date,
      default: 0,
    },
    votedUsers: [
      {
        username: { type: String },
        vote: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true },
);

UserSchema.plugin(softDeletePlugin);
const User = mongoose.model('users', UserSchema);

module.exports = User;
