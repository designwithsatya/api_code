const mongooose = require("mongoose");

const CommentSchema = new mongooose.Schema({
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

const CommentModel = mongooose.model("comment", CommentSchema);
module.exports = CommentModel;
