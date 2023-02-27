const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const multer = require("multer");
const fs = require("fs");
app.use(bodyParser.urlencoded({ extended: true }));

require("../db/conn");
const Post = require("../model/Post");

//set storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: { fieldSize: 25 * 1024 * 1024 },
});

router.post("/post", authenticate, upload.single("file"), async (req, res) => {
  var img = fs.readFileSync(req.file.path);
  var encode_img = img.toString("base64");
  var final_img = {
    contentType: req.file.mimetype,
    data: new Buffer.from(encode_img, "base64"),
  };

  const { title, summary, content, category } = req.body;
  if (!title || !summary || !content || !category) {
    return res.status(422).json({ error: "Plz filled the properties" });
  }
  try {
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: final_img,
      category,
      author: req.rootUser,
    });
    res.json(postDoc);
  } catch (error) {
    console.log(error);
  }
});

//pagination
router.get("/post", (req, res) => {
  const page = req.query.page || 1;
  const perPage = req.query.perPage || 6;
  Post.find()
    .populate("author", ["name"])
    .sort({ createdAt: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .then((data) => {
      Post.countDocuments().then((count) => {
        res.json({
          data,
          totalPages: Math.ceil(count / perPage),
        });
      });
    });
});

router.get("/post/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate("author", ["name"]);
    res.json(postDoc);
  } catch (error) {
    console.log(error);
  }
});

router.put("/post", authenticate, upload.single("file"), async (req, res) => {
  const { id, title, summary, content, category } = req.body;
  const postDoc = await Post.findById(id);
  const isAuthor =
    JSON.stringify(postDoc.author) === JSON.stringify(req.rootUser._id);
  if (!isAuthor) {
    return res.status(400).json("you are not the author");
  }
  try {
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
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
