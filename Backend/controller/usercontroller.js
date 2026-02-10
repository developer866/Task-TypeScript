const User = require('../models/user')

// Register new User 
const registerUser = async (req,res)=>{
    res.json("added user details")
}

// Get all user
const getUsers = async(req,res) =>{
    res.json("get all user")
}

module.exports = {registerUser,getUsers}