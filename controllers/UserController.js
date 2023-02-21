const User = require("../models/User");
const Bookmark = require("../models/UserBookmark");
const MCQ = require("../models/MCQ");

const postUser = async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  try {
    // console.log(req.query);
    let user = await User.findOne({
      userGoogleID: req.query.googleId,
    });
    if (user) {
      // console.log(`User already in the database`);
    } else {
      // console.log(`here i am`)
      try {
        User.create({
          userGoogleID: req.query.googleId,
          userDisplayName: req.query.displayName,
          userGivenName: req.query.givenName,
          userEmail: req.query.email,
          userPicture: req.query.imageUrl,
          mcqsAttempted: [
            {
              mcqID: "6969",
              userAnswer: "default",
              correct: false,
            },
          ],
        });
        // console.log(`New user created!`);
      } catch (err) {
        const error = new Error(`An error occurred.`);
        error.error = err;
        next(error);
      }
    }
  } catch (err) {
    const error = new Error(`An error occurred.`);
    error.error = err;
    next(error);
  }
};

const getUser = async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  try {
    let user = await User.findOne({
      userGoogleID: req.query.userID,
    });
    res.send(user);
  } catch (err) {
    const error = new Error(`An error occurred.`);
    error.error = err;
    next(error);
  }
};

const bookmarkQuestion = async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  try {
    let userBookmark = await Bookmark.findOne({
      userID: req.query.userID,
    });
    // console.log(userBookmark);
    if (!userBookmark) {
      Bookmark.create({
        userID: req.query.userID,
        bookmarks: [req.query.mcqID],
      });
      console.log(`Bookmark created`);
    } else {
      let bookmarksArray = userBookmark.bookmarks;
      if (userBookmark.bookmarks.indexOf(req.query.mcqID) === -1) {
        console.log(`in if statement`);
        bookmarksArray.push(req.query.mcqID);
        console.log(bookmarksArray);

        await userBookmark.updateOne({
          $set: {
            bookmarks: bookmarksArray,
          },
        });
      } else {
        console.log(`in else statement`);
        const newBookmarksArray = bookmarksArray.filter(function (
          value,
          index,
          arr
        ) {
          console.log(value !== req.query.mcqID);
          return value !== req.query.mcqID;
        });
        await userBookmark.updateOne({
          $set: {
            bookmarks: newBookmarksArray,
          },
        });
      }

      console.log(`Bookmark updated`);
    }
  } catch (err) {
    console.error(err);
  }
};

const getBookmarks = async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  try {
    let bookmarks = await Bookmark.findOne({
      userID: req.query.userID,
    });
    if (!bookmarks) {
      bookmarks = null;
    }
    res.send(bookmarks);
  } catch (err) {
    console.error(err);
  }
};

const storeMCQResult = async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  try {
    let user = await User.findOne({
      userGoogleID: req.query.userID,
    });
    let mcqID = req.query.mcqID;
    let tempUserAnswer = req.query.userAns;
    let mcq = await MCQ.findOne({
      _id: mcqID,
    });
    let userAns = null;
    switch (parseInt(tempUserAnswer)) {
      case 1:
        userAns = mcq.option1;
        break;
      case 2:
        userAns = mcq.option2;
        break;
      case 3:
        userAns = mcq.option3;
        break;
      case 4:
        userAns = mcq.option4;
        break;
      default:
        break;
    }
    let correct = null;
    if (userAns === mcq.correct) {
      correct = true;
    } else {
      correct = false;
    }
    let userMCQsAttempted = user.mcqsAttempted;
    if (
      userMCQsAttempted.filter((e) => e.mcqID === req.query.mcqID).length > 0
    ) {
      console.log(`MCQ already in the array`);
    } else {
      userMCQsAttempted.push({
        mcqID: mcqID,
        userAnswer: userAns,
        correct: correct,
      });
      await user.updateOne({
        mcqsAttempted: userMCQsAttempted,
      });
      console.log(`UserMCQ Array updated`);
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  postUser,
  getUser,
  bookmarkQuestion,
  getBookmarks,
  storeMCQResult,
};
