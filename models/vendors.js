const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  member_type: {
    type: String,
    required: "Member's type is required",
    max: 32,
    trim: true,
  },
  member_id: {
    type: String,
    required: "Member's ID is required",
    max: 32,
    trim: true,
  },

  member_name: {
    type: String,
    required: "Member's name is required",
    max: 32,
    trim: true,
  },
  member_contact: {
    type: Number,
    required: "Member's contact is required",
    trim: true,
  },
  member_password: {},
  member_username: {},
  member_balance: {
    type: Number,
    trim: true,
    default: 0,
  },
  member_movements: [],
  movement_dates: [],
  member_pin: {
    type: Number,
    trim: true,
  },
});

// exporting the module
module.exports = mongoose.model("Vendors", vendorSchema);
