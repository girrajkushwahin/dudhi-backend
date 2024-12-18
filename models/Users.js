var mongoose = require("mongoose");
var crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxlenght: 32,
      trim: true,
    },
    lastName: {
      type: String,
      maxlenght: 32,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
    encry_password: {
      type: String,
    },
    membershipType: {
      default: null,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
    },
    picture: {
      default: "",
      type: String,
    },
    count: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: String,
      default: false,
    },

    isDisabled: {
      type: String,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainPassword) {
    return this.securePassword(plainPassword) === this.encry_password;
  },

  securePassword: function (plainPassword) {
    if (!plainPassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("hex");
    } catch (error) {
      return "";
    }
  },
};

const User = mongoose.model("users", userSchema);
module.exports = User;
