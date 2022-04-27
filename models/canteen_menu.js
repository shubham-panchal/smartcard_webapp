const mongoose = require("mongoose");

const canteenMenuSchema = new mongoose.Schema({
  item_name: {
    type: String,
    required: "Item name is required",
    max: 32,
    trim: true,
  },
  item_img: {
    type: String,
    // required: "Member's ID is required",
    // max: 32,
    // trim: true,
  },
  item_price: {
    type: Number,
    required: "Item price is required",
    trim: true,
  },
});

// exporting the module
module.exports = mongoose.model("CanteenMenu", canteenMenuSchema);
