const express = require("express");
const { registerUser, getUsers } = require("../controller/usercontroller");

const router = express.Router();

router.get("/", getUsers);
router.post("/register", registerUser);

module.exports = router;
