const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
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
    latitude: String,
    longitude: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      ref: "User",
    },
    defaultAddress: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
