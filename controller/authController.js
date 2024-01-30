const asyncHandler = require("express-async-handler");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = asyncHandler(async (req, res) => {
  const { firstname: firstName, lastname : lastName, email, password, phone } = req.body;

  // Check if required fields are provided
  if ( !firstName || !lastName || !email || !password || !phone ) {
    return res.status(400).json({ msg: "Please provide all required fields." });
  }

  // Check if a user with the provided email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ msg: "User with this email already exists." });
  }

  // Generate salt and hash the password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  // Create a new user with hashed password
  const newUser = await User.create({ firstName, lastName, email, password: hashedPassword , phone});
  // If user creation is successful, generate JWT token
  if (newUser) {
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expiration time in seconds (e.g., 1 hour)
    });

    // If token is generated successfully, send the response
    if (token) {
      return res.json({
        token,
        user: {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
        },
      });
    }
  }

  // If something goes wrong, send a generic error response
  return res.status(500).json({ msg: "Internal server error. Please try again later." });
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Please provide both email and password." });
    }

    // Check if a user with the provided email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials. User not found." });
    }

    // Verify the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid credentials. Password does not match." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expiration time (e.g., 1 hour)
    });

    // Respond with token and user information
    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });

 return res.status(500).json({ msg: "Internal server error. Please try again later." });
});

module.exports = { register, login };
