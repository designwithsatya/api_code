const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;
const EmailSender = require("./sendEmail");
const app = express();

app.use(cookieParser());
dotenv.config({ path: "./config.env" });
require("./db/conn");
app.use(express.json());
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// ****** SEND API
app.get("/", async (req, res) => {
  res.send("Production is working");
});
app.post("/send", async (req, res) => {
  try {
    const { fullName, email, message } = req.body;
    EmailSender({ fullName, email, message });
    res.json({ msg: "Your message sent successfully" });
  } catch (error) {
    res.status(404).json({ msg: "Error" });
  }
});

//user router
app.use(require("./router/userComment"));
app.use(require("./router/userAuth"));
app.use(require("./router/Post"));

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
