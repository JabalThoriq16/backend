const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    userGoogleID: String,
    userDisplayName: String,
    userEmail: String,
    userGivenName: String,
    userPicture: String,
    mcqsAttempted: [
      {
        mcqID: String,
        userAnswer: String,
        correct: Boolean,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model("User", userSchema);
module.exports = user;
