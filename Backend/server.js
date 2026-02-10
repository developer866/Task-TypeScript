const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./Config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cors());

dotenv.config();
app.use(express.json());
connectDB();

app.get("/", (req, res) => {
  res.status(200).send("Welcome our store");
});
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Runing at ${PORT}`);
});
