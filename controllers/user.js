const User = require("../models/Users");
var crypto = require("crypto");
//var uuid = require("uuid/v1");
const { v1: uuidv1 } = require("uuid");
//const expressJwt = require("express-jwt");
const { expressjwt: JWT } = require("express-jwt");

exports.tokenId = JWT({
  secret: "SECRET",
  userProperty: "auth",
  algorithms: ["HS256"],
});

// *****************getUserbyId****************

exports.getuserbyId = async (req, res, next, id) => {
  const user = await User.findById(id);
  if (!user) {
    return res.status(400).json({ message: "User Not Found" });
  } else {
    req.profile = user;
    next();
  }
};

// ****************** getUser ***********************

exports.getUser = async (req, res) => {
  const user = await User.findOne({ _id: req.profile._id });
  if (!user) {
    return res.status(400).json({ message: "User Not Found" });
  } else {
    (user.salt = undefined), (user.encry_password = undefined);
    return res.status(200).json({ success: true, data: user });
  }
};

// ***************** getAllUser *********************

exports.getAllUser = async (req, res) => {
  const allUsers = await User.find();
  if (!allUsers) {
    return res.status(400).json({ message: "Users Not Found" });
  } else {
    allUsers.map((user) => {
      (user.salt = undefined), (user.encry_password = undefined);
    });
    return res.status(200).json({ success: true, data: allUsers });
  }
};

// ****************** updateUser ************************

exports.updateId = async (req, res) => {
  if (req.body.password) {
    req.body.salt = uuidv1();
    req.body.encry_password = crypto
      .createHmac("sha256", req.body.salt)
      .update(req.body.password)
      .digest("hex");
  }

  const updatedUser = await User.updateOne(
    { _id: req.profile._id },
    {
      $set: req.body,
    },
    { new: true, useFindAndModify: false }
  );
  if (!updatedUser) {
    return res.status(500).json({ message: "error updating user" });
  } else {
    (updatedUser.salt = undefined), (updatedUser.encry_password = undefined);
    return res.status(200).json({ success: true, data: updatedUser });
  }
};

// ************** RecoverIdbyPassword *****************

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (oldPassword) {
    const user = await User.findOne({ _id: req.profile._id });
    if (!user) {
      return res.status(422).json({
        error: "No User Found! Create an Account.",
      });
    }
    if (!user.authenticate(oldPassword)) {
      return res.status(400).json({ message: "Old password did not match" });
    }
    if (newPassword === oldPassword) {
      return res.status(403).json({
        success: false,
        message: "Your new password should be different from the old password!",
      });
    }

    if (newPassword) {
      //req.body.salt = uuid();
      req.body.salt = uuidv1(); 
      req.body.encry_password = crypto
        .createHmac("sha256", req.body.salt)
        .update(newPassword)
        .digest("hex");

      const updatedPassword = await User.findByIdAndUpdate(
        { _id: req.profile._id },
        {
          $set: {
            salt: req.body.salt,
            encry_password: req.body.encry_password,
          },
        },
        { new: true, useFindAndModify: false }
      );

      if (!updatedPassword) {
        return res.status(400).json({
          success: false,
          error: "Something Went Wrong! Try Again",
        });
      }

      user.salt = undefined;
      user.encry_password = undefined;
      res.json({
        success: true,
        message: "Password Changed Successfully",
        data: user,
      });
    }
  } else {
    return res.json("Only password fields allowed");
  }
};
