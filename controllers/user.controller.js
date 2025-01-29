const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');
require('dotenv').config();

const signUp = async (req, res) => {
  try {
    const { name, email, password, age, phone } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const userExist = await User.findOne({ where: { email } });
    if (userExist) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      age,
      phone
    });

    await newUser.save();
    res.status(201).json({ message: 'User signed up successfully', user: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const login= async(req, res)=>{
    try {
        const {email, password}= req.body;
        
        if(!email || !password){
            return res.status(400).json({message: 'Email and password are required'});
        }

        const userExist= await User.findOne({where: {email}});
        if(!userExist){
            return res.status(404).json({message: 'User not found'});
        }

        const isMatch= await bcrypt.compare(password, userExist.password);
        if(!isMatch){
            return res.status(401).json({message: 'Invalid credentials'});
        }

        const token= jwt.sign({id: userExist._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({message: 'User login successful', token});
        
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
}

module.exports = { signUp, login };