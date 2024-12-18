const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    photos: [],
    logo: {
      type: String,
      trim: true,
      required: true
    },
    logodimension: {
      type: String,
      trim: true,
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      ref: "Category",
    },
    discount: {
      type: String,
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    subtitle: {
      type: String,
      required: true,
      trim: true
    },
    rusticfinishes: [],
    texturefinishes: [],
    colorfinishes: [],
    pricing: [],
    units: { type: Number },
    stock: { type: Number },
    sold: { type: Number, default: 0 },
    visibility: {
      type: String,
      default: "true",
    },
    ratings: [
      {
        star: Number,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
