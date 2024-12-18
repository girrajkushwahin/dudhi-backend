const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        item: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        size: {
          type: mongoose.Schema.Types.Object,
          default: {}
        },
        qty: { type: Number },
        price: { type: Number },
        discount: { type: String },
        status: {
          type: String,
          default: "Pending",
          enum: [
            "Pending", //pending, cancelled, ordered, these status will be updated by user
            "Cancelled",
            "Ordered",
            "Shipped", //shipped , outForDeivery, Delivered , these status will be updated by admin
            "OutForDelivery",
            "Delivered",
          ],
        },
        // startDate: { type: Date },
        // endDate: { type: Date },
      },
    ],

    address: {
      name: String,
      mobile: Number,
      pincode: Number,
      locality: String,
      address: String,
      city: String,
      state: String,
      landmark: String,
      alternateMobile: Number,
      addressType: String,
    },

    // order-id 

    transaction: { type: String, default: "" },
    Bill_Amount: { type: Number },

    Payment_mode: {
      default: "",
      type: String,
      enum: ["", "COD", "Payonline"],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

const order = mongoose.model("Order", orderSchema);
module.exports = order;
