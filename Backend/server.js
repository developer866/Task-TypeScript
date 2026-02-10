const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./Config/db");
const User = require("./models/user");

dotenv.config();

const app = express();
// connect database
connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  reson.status(200).send("Welcome our store");
});
app.get("/test-user", async (req, res) => {
  const user = await User.create({
    name: "Test User",
    email: "test@project.com",
    password: "123456",
  });
  res.json(user);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Runing at ${PORT}`);
});
