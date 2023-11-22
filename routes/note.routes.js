const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticator = require("../middlewares/authenticator.js");
const { NoteModel } = require("../models/NoteModel.js");
const { UserModel } = require("../models/userModel.js");

const noteRouter = express.Router();
noteRouter.use(authenticator);

noteRouter.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization;
    // Check if the token is present
    if (!token) {
      return res.status(401).send({
        message: "Token is missing, please login",
        status: 2,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decode data", decoded.userId);
    const userId = decoded.userId;

    console.log("user id for test", userId);

    if (!userId) {
      return res.status(401).send({
        message: "User ID not found in the token",
        status: 2,
      });
    }
    // Fetch notes for the logged-in user
    // let data = await UserModel.find({ user: userId });
    // console.log(data);

    let data = await NoteModel.find({}); //get usesr id by token, sending token to the perticular authenticator
    console.log("MongoDB Query Result:", data);

    if (data !== null) {
      // Send the data if there are results
      res.status(200).send({
        data: data,
        message: "Success",
        status: 1,
      });
    } else {
      // Send a message if no data is found for the user
      res.status(404).send({
        message: "No data found for the user",
        status: 0,
      });
    }
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).send({
      message: "Internal server error",
      status: 0,
    });
  }
});

noteRouter.post("/create", async (req, res) => {
  try {
    // Validate request data (customize this based on your requirements)
    const { title, content, user } = req.body;

    if (!title || !content || !user) {
      return res.status(400).send({
        message: "Title and content are required",
        status: 0,
      });
    }

    // Create a note
    const note = new NoteModel({ title, content, user });

    // save the note to the database
    await note.save();
    // Send success response
    res.status(200).send({
      message: "Note Created",
      status: 1,
      note: note,
    });
  } catch (error) {
    console.error("Error creating note:", error);

    res.status(500).send({
      message: "Internal server error",
      status: 0,
    });
  }
});

noteRouter.patch("/update/:id", async (req, res) => {
  let id = req.params.id;
  console.log("id for new", id);
  try {
    const updatedNote = await NoteModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedNote) {
      return res.status(404).send({
        message: "Note not found",
        status: 0,
      });
    }

    res.send({
      message: "Note updated",
      status: 1,
      updatedNote: updatedNote,
    });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).send({
      message: error.message,
      status: 0,
    });
  }
});

noteRouter.delete("/delete/:id", async (req, res) => {
  let id = req.params.id;
  console.log("Received delete request for id:", id);
  try {
    const deletedNote = await NoteModel.findByIdAndDelete(id);
    if (!deletedNote) {
      return res.status(404).send({
        message: "Note not found",
        status: 0,
      });
    }

    res.send({
      message: "Note deleted",
      status: 1,
    });
  } catch (error) {
    res.send({
      message: error.message,
      status: 0,
    });
  }
});

module.exports = noteRouter;
