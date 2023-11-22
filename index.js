const express = require("express");
const cors = require("cors");
const db = require("./db");
const userRouter = require("./routes/user.routes");
const noteRouter = require("./routes/note.routes");
require("dotenv").config();
const port = process.env.PORT;
const app = express();

const corsOptions = {
  origin: "http://localhost:3000", // replace with your frontend's URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // enable passing of cookies from the frontend
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/user", userRouter);
app.use("/note", noteRouter);

app.get("/", (req, res) => {
  res.send({
    message: "api is working now",
  });
});

app.listen(port, async () => {
  try {
    await db;
    console.log("Database is connected");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
  console.log("Server is running on port number", port);
});
