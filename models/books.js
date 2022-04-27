const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  book_id: {
    type: String,
    required: "Book's ID is required",
    max: 32,
    trim: true,
  },

  book_name: {
    type: String,
    required: "Book's name is required",
    max: 32,
    trim: true,
  },
  author: {
    type: String,
    required: "Book's author is required",
    max: 32,
    trim: true,
  },
  publication: {
    type: String,
    required: "Book's publication is required",
    max: 32,
    trim: true,
  },
  issued_by: {
    type: String,
    default: "",
    // required: "Borrower's id is required",
  },
  available: {
    type: Boolean,
    required: "Availability is required",
  },
});

// exporting the module
module.exports = mongoose.model("Books", bookSchema);
