const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      maxlength: 32,
      ref: "users",
      unique: true,
    },
    products: [
      {
        item: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        qty: { type: Number, default: 1 },
        price: { type: Number, trim: true },
        color: { type: String, trim: true },
        discount: { type: String, trim: true },
        size: {
          type: mongoose.Schema.Types.Object,
          default: {}
        }
      }
    ]
  },
  { timestamps: true }
)

const cart = mongoose.model("cart", cartSchema)
module.exports = cart
