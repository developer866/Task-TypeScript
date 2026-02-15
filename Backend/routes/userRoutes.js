const express = require("express");
const auth = require("../middleware/auth")
const { registerUser, getUsers ,LoginUser} = require("../controller/usercontroller");

const router = express.Router();

router.get("/",auth, getUsers);
router.post("/register", registerUser);
router.post("/Login",LoginUser)

module.exports = router;
