const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const multer = require("multer");
const fs = require("fs");

require("../db/conn");
const Post = require("../model/Post");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
router.post("/post", authenticate, upload.single("file"), async (req, res) => {
  const { title, summary, content, category } = req.body;
  try {
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: {
        data: fs.readFileSync("uploads/" + req.file.filename),
        contentType: "image/",
      },
      category,
      author: req.rootUser,
    });
    res.json(postDoc);
  } catch (error) {
    console.log(error);
  }
});

router.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["name"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

router.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["name"]);
  res.json(postDoc);
});

router.put("/post", authenticate, upload.single("file"), async (req, res) => {
  const { id, title, summary, content, category } = req.body;
  const postDoc = await Post.findById(id);
  const isAuthor =
    JSON.stringify(postDoc.author) === JSON.stringify(req.rootUser._id);
  if (!isAuthor) {
    return res.status(400).json("you are not the author");
  }
  await postDoc.updateOne({
    title,
    summary,
    content,
    category,
    cover: {
      data: fs.readFileSync("uploads/" + req.file.filename),
      contentType: "image/",
    },
  });

  res.json(postDoc);
});

module.exports = router;
