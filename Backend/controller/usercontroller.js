const User = require("../models/user");

// Register new User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // check if user exist
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "user already exists" });
    }
    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if Filed is empty
   if(!email || !password){
    return res.status(400).json({message:"Fields cannot be empty"})
   }
   const user = await User.findOne({email});
   if(!user){
    return res.status(401).json({message:"user deoosnt exist"})
   }
   if(user.password !== password){
    return res.status(401).json({message:"Incorrect credentials"})
   }
 
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get all user
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, getUsers, LoginUser };
