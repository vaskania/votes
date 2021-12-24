const mongoose = require('mongoose');

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
    deleted: {
      type: Boolean,
      index: true,
      default: false,
    },
  },
  // { timestamps: true },
);

const User = mongoose.model('users', UserSchema);

module.exports = User;
