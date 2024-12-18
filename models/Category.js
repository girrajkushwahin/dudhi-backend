const mongoose = require("mongoose");

const pricingandfeesTitleSchema = new mongoose.Schema(
  {
    Category: {
      type: String,
      required: true,
      trim: true
    },
    subtitle: {
      type: String,
      required: true,
      trim: true
    },
    detail1: {
      type: String,
      required: true,
      trim: true
    },
    detail2: {
      type: String,
      required: true,
      trim: true
    },
    Logo: {
      type: String,
      trim: true,
      required: true
    },
    Parent_Category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", pricingandfeesTitleSchema);
module.exports = Category;
