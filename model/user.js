const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    UserName: {
      type: String,
    },
    Email: {
      type: String,
    },
    Profile: {
      type: String,
    },
    Password: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("User", userSchema);
