const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      maxlenght: 32,
      ref: "User",
      unique: true,
    },
    products: [
      {
        item: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      },
    ],
  },
  { timestamps: true }
);

const wishList = mongoose.model("WishList", wishListSchema);
module.exports = wishList;
