const mongoose = require("mongoose");

const libraryFineLogSchema = new mongoose.Schema({
  member_id: {
    type: String,
    required: "Member name is required",
    max: 32,
    trim: true,
  },
  movement_date: {
    type: String,
    // required: "Member's ID is required",
    // max: 32,
    // trim: true,
  },
  movement: {
    type: Number,
    required: "Item price is required",
    trim: true,
  },
});

// exporting the module
module.exports = mongoose.model("libraryFineLogs", libraryFineLogSchema);
