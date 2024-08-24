import { User } from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// User Registration Controller
export const registerUser = async (req, res) => {
  try {
    const { email, fullName, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle profile picture if provided
    const profilePic = req.body.profilePic ? req.body.profilePic : "";

    // Create a new user
    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
      profilePic,
    });

    // Save the user to the database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET, {
      expiresIn: "48h",
    });

    // Send response
    res.status(201).json({
      message: "User registered successfully",
      data: {
        _id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        profilePic: newUser.profilePic,
        token,
      },
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(400).json({ success: false, error:error });
  }
};

// User Sign-In Controller
export const userSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists or not
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User doesn't exist" });
    }

    // Validate the password is correct or not
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "48h",
    });

    // Send response
    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        profilePic: user.profilePic,
        token,
      },
    });
  } catch (error) {
    console.error("Error during user sign-in:", error);
    res.status(400).json({ success: false, error:error });
  }
};
