const User = require('./models/user')

// Register new User 
const registerUser = async (req,res)=>{
    res.status(200).json("added user details")
}

// Get all user
const getUsers = async(req,res) =>{
    res.status(200).json("get all user")
}

module.exports ={registerUser,getUsers}