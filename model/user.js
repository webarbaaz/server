const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email: {
      type: String,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
      require: true,
    },
    password: { type: String, require: true },
    phone: { type: String, require: true },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
