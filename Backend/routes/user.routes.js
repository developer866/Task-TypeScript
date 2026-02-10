const express = require("express")
const {registerUser,getUsers} = require("../controller/usercontroller")

const router = express.Router()
router.get("/",getUSer)
router.post()