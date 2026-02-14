const express = require("express");
const { registerUser, getUsers ,LoginUser} = require("../controller/usercontroller");

const router = express.Router();

router.get("/", getUsers);
router.post("/register", registerUser);
router.post("/Login",LoginUser)

module.exports = router;
