const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res, next) => {
  // check for valid email and password
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400) // Invalid request
      .json({ message: 'Username and password are required.' });

  // check for duplicates in the DataBase
  const duplicate = await User.findOne({ email: email }).exec();
  if (duplicate)
    return res
      .status(409) // Conflict
      .json({ message: 'Email already exists in DataBase.' });

  try {
    // encrypt the password
    const hashedPwd = await bcrypt.hash(
      password,
      parseInt(process.env.SIGNUP_ACCESS)
    );

    // add the new user to the DataBase
    const result = await User.create({
      email: email,
      password: hashedPwd,
    });

    res.status(201).json({ message: 'New user created!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res, next) => {
  // check for valid email and password
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400) // Invalid request
      .json({ message: 'Username and password are required.' });

  // check for existing user
  const foundUser = await User.findOne({ email: email }).exec();
  if (!foundUser)
    return res
      .status(401) // Unauthorized
      .json({ message: 'User not found in DataBase.' });

  try {
    // check for valid password
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match)
      return res
        .status(401) // Unauthorized
        .json({ message: 'Invalid password.' });

    // send token
    const token = jwt.sign(
      { userId: foundUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { signup, login };
