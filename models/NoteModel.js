const mongoose = require("mongoose");

const noteSchema = mongoose.Schema(
  {
    title: { type: String, require: true },
    content: { type: String, require: true },
    user: { type: String, require: true },
  },
  {
    versionkey: false,
  }
);

const NoteModel = mongoose.model("notes", noteSchema);

module.exports = {
  NoteModel,
};
