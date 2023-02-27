const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentSchema = new mongoose.Schema({
  user: {
    type: String,
  },
  message: {
    type: String,
  },
  likes: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  editable: {
    type: Boolean,
  },
  replies: [
    {
      user: {
        type: String,
      },
      message: {
        type: String,
      },
      likes: {
        type: Number,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const CommentModel = mongoose.model("comment", CommentSchema);
module.exports = CommentModel;
