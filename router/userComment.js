const express = require("express");
const router = express.Router();

require("../db/conn");
const CommentModel = require("../model/CommentSchema");

//GetCommentData
router.get("/getdata", (req, res) => {
  CommentModel.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  }).limit(req.body.limitNum);
});

//new comment
router.post("/newcommnet", (req, res) => {
  let messageData = req.body.messageData;
  const newMessage = new CommentModel({
    user: "unknown",
    message: messageData,
    likes: 0,
    aditable: true,
    replies: [],
  }).save();
  res.send("");
});

//getmoredata
router.post("/getmoredata", (req, res) => {
  let commentincreement = req.body.commentincreement;
  CommentModel.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  })
    .skip(commentincreement)
    .limit(10);
});

//postsubcomment
router.post("/postsubcomments", (req, res) => {
  let messageData = req.body.messageData;
  let messageId = req.body.messageId;
  const newSubMessage = {
    user: "DesignWithsatya",
    message: messageData,
    likes: 0,
  };
  CommentModel.updateOne(
    { _id: messageId },
    { $push: { replies: newSubMessage } },
    (err) => {
      if (err) console.log(err);
    }
  );
});

//message update
router.post("/messageupdate", (req, res) => {
  let commentId = req.body.commentId;
  CommentModel.findOne({ _id: commentId }, (err, data) => {
    if (!err) res.send(data);
  });
});

//delete message
router.post("/deletemesage", (req, res) => {
  let messageId = req.body.messageId;
  CommentModel.deleteOne({ _id: messageId }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.data("");
    }
  });
});
//delete sub message
router.post("/deletesubmessageuser", (req, res) => {
  let messageId = req.body.messageId;
  let subId = req.body.subId;
  CommentModel.updateOne(
    { _id: messageId },
    { $pull: { replies: { _id: subId } } },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.send("");
      }
    }
  );
});

//user like update
router.post("/updatelike", (req, res) => {
  let messageId = req.body.messageId;
  let likes = req.body.likes;
  CommentModel.updateOne({ _id: messageId }, { likes: likes }, (err) => {
    if (err) console.log(err);
  });
});

router.post("/updateSublike", (req, res) => {
  let messageId = req.body.messageId;
  let subId = req.body.subId;
  let likes = req.body.likes;
  CommentModel.updateOne(
    { _id: messageId, "replies._id": subId },
    { $set: { "replies.$.likes": likes } },
    (err, data) => {
      if (err) console.log(err);
    }
  );
});

module.exports = router;
