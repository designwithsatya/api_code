const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");

require("../db/conn");
const User = require("../model/userSchema");

//user register
router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;
  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "Plz filled the field properly" });
  }
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email already Exist" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "password are not matching" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });
      await user.save();
      res.status(201).json({ message: "user registered successfuly" });
    }
  } catch (err) {
    console.log(err);
  }
});

// user login

router.post("/signin", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Plz Filled the data" });
    }
    const userLogin = await User.findOne({ email: email });
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);
      if (!isMatch) {
        res.status(400).json({ error: "Invalid Credientials " });
      } else {
        token = await userLogin.generateAuthToken();
        res.cookie("jwtoken", token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true,
        });

        res.json({ id: userLogin._id, email });
      }
    } else {
      res.status(400).json({ error: "Invalid Credientials " });
    }
  } catch (err) {
    console.log(err);
  }
});

// uthenticate about

router.get("/about", authenticate, (req, res) => {
  res.send(req.rootUser);
});

// contact us page

// router.post("/contact", authenticate, async (req, res) => {
//   try {
//     const { name, email, message } = req.body;

//     if (!name || !email || !message) {
//       console.log("error in contact form");
//       return res.json({ error: "plzz filled the contact form " });
//     }

//     const userContact = await User.findOne({ _id: req.userID });

//     if (userContact) {
//       const userMessage = await userContact.addMessage(name, email, message);

//       await userContact.save();

//       res.status(201).json({ message: "user Contact successfully" });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

// user logout
router.get("/logout", (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("user logout");
});

module.exports = router;
