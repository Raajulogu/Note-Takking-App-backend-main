const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send("All the users");
});

// Register
userRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Hash the password asynchronously
    const hash = await bcrypt.hash(password, 5);

    // Create a new user instance with the hashed password
    let user = new UserModel({ name, email, password: hash });

    // save the user to the database
    await user.save();

    // send success response
    res.send({
      message: "User Created",
      status: 1,
    });
  } catch (error) {
    res.send({
      message: error.message || "Something went Wrong",
      status: 0,
    });
  }
});

// Login
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let option = {
    expiresIn: "30m",
  };

  try {
    // Find user by email
    const user = await UserModel.findOne({ email });

    if (user) {
      // Compare passwords
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          return res.status(500).send({
            message: "Something went wrong: " + err,
            status: 0,
          });
        }

        if (result) {
          // Generate JWT token using the secret key from environment variable
          const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            option
          );

          // Send success response with token
          res.send({
            message: "User logged in successfully",
            token: token,
            status: 1,
          });
        } else {
          // Incorrect password
          res.send({
            message: "Incorrect password",
            status: 0,
          });
        }
      });
    } else {
      // User not found
      res.send({
        message: "User does not exist",
        status: 0,
      });
    }
  } catch (error) {
    // Handle other errors
    res.status(500).send({
      message: "Internal server error: " + error.message,
      status: 0,
    });
  }
});

module.exports = userRouter;
