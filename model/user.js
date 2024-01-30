const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    require: [true, "first name is require"],
  },
  lastName: {
    type: String,
    require: [true, "last name is require"],
  },
  email: {
    type: String,
    unique: true,
    index: true,
    trim: true,
    lowercase: true,
    require: [true, "email is require"],
  },
  password: {
    type: String,
    require: [true, "password is require"],
  },
  phone: {
    type: String,
    require: [true, "phone is require"],
  },
});

module.exports = mongoose.model("User", userSchema);
