const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
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
  member_department: {
    type: String,
    required: "Member's department is required",
    max: 32,
    trim: true,
  },
  //   member_branch: {
  //     type: String,
  //     required: "Member's branch is required",
  //     max: 32,
  //     trim: true,
  //   },
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
  member_movements: {
    type: Array,
  },
  member_pin: {
    type: Number,
    trim: true,
  },
  member_courses: [],
  movement_dates: [],
  movement_id: [],
});

// exporting the module
module.exports = mongoose.model("Faculties", facultySchema);
