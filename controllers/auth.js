const User = require("../models/Users");
const Cart = require("../models/Cart");
const WishList = require("../models/WishList");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
//const expressJwt = require("express-jwt");
//const { expressjwt: JWT } = require("express-jwt");
var nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");
var crypto = require("crypto");
//var uuid = require("uuid/v1");
//const { v1: uuidv1 } = require("uuid");

const SECRET = process.env.SECRET_KEY;

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()[0].msg,
    });
  }
  try {
    const { firstName, email, password, phoneNo } = req.body;
    const user = new User({ firstName, email, password, phoneNo });

    await user.save();

    await Cart.create({ user: user._id });
    await WishList.create({ user: user._id });
    // console.log("user", user);
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } catch (err) {
    console.log("err", err);
    if (err.code === 11000) {
      const fieldName = err.keyValue.phoneNo ? "Phone no" : "Email";
      return res.status(400).json({
        error: `${fieldName} already in use`,
      });
    }
    return res.status(400).json({
      error: "An error occurred while signing up",
    });
  }
};

// var smtpTransport = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port:  587,
//     service: "Gmail",
//     auth: {
//         user: "shashighopi@gmail.com",
//         pass: "Amit@1111"
//     },

// })
// mailOptions = {
//     from:'teamhealthdock@gmail.com',
//     to : req.body.email,
//     subject : "Please confirm your Email account",
//     html : `Hello,<br> Please Click on the link to verify your email.<br><a href="http://localhost:3001/signin?user_id=${user._id}">Click here</a>`
// }
// smtpTransport.sendMail(mailOptions,
//     function(error, response){
//         if(error){
//                console.log(error);
//            res.send("error");
//         }
//         res.json(response + 'sent')
//     }
// )

// ****************** VerifyUserbyId ********************

exports.getUserbyId = async (req, res, next, id) => {
  //console.log(id);
  const user = await User.findById({ _id: id });
  if (!user) {
    return res.status(400).json({ message: "Unable to find user" });
  }
  req.profile = user;
  //console.log(req.profile);
  next();
};
// ********************** signin ***********************

exports.signin = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()[0].msg,
    });
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(400)
      .json({ message: "No User Found! Create a Account." });
  }

  if (!user.authenticate(req.body.password)) {
    return res.status(400).json({ message: "password didnot match" });
  }

  const token = jwt.sign({ _id: user._id }, "SECRET");
  //console.log("secret key", SECRET);

  res.cookie("token", token, { expire: new Date() + 9999 });

  //res to front-end
  const { _id, firstName, role, email } = user;
  return res.json({ token, user: { _id, firstName, role, email } });
};

exports.socialLogin = (req, res) => {
  const { Token_ID } = req.body;
  console.log(Token_ID);
  const client = new OAuth2Client(
    "80570699491-b2rpc98k0olclipeu5peahq9f38fen6n.apps.googleusercontent.com"
  );
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: Token_ID,
      audience:
        "80570699491-b2rpc98k0olclipeu5peahq9f38fen6n.apps.googleusercontent.com", // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
    const userEmail = payload["email"];
    const userfirstName = payload["given_name"];
    const userlastName = payload["family_name"];
    const userPic = payload["picture"];

    const doc = await User.updateOne(
      { email: userEmail }, // Query parameter
      {
        $setOnInsert: {
          firstName: userfirstName,
          lastName: userlastName,
          picture: userPic,
        },
      },
      { upsert: true }
    );

    const finDoc = await User.findOne({ email: userEmail }, (err, data) => {
      if (err || !data) {
        return res.status(422).json({
          error: "No User Found! Create a Account.",
        });
      }

      async function showData(data) {
        const cart = await Cart.create({ user: data._id }, (err, user) => {
          if (err) {
            return;
          }
          return;
        });

        const wishlist = await WishList.create(
          { user: data._id },
          (err, user) => {
            if (err) {
              return;
            }
            return;
          }
        );

        const token = await jwt.sign({ _id: data._id }, "SECRET");

        res.cookie("token", token, { expire: new Date() + 9999 });

        //res to front-end
        const { _id, firstName, lastName, role, email, picture } = data;
        return res.json({
          token,
          user: { _id, firstName, lastName, role, email, picture },
        });
      }
      showData(data);
    });

    // If request specified a G Suite domain:
    // const domain = payload['hd'];
  }
  verify().catch((error) => console.log(error));
};

// ******************** forgotPassword *************************
exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()[0].msg,
    });
  }
  const { email } = req.body;
  console.log(email);

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(422).json({ message: "User Email doesnot exist" });
  }
  const token1 = jwt.sign({ _id: user._id }, "FORGOTTEN", {
    expiresIn: "2h",
  });

  // email config

  const transporter = nodemailer.createTransport({
    /*service: "gmail",
    auth: {
      user: "twinkleu455@gmail.com",
      pass: "Twinkle@123*",
    },*/
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "twinkleu455@gmail.com",
      pass: "votoaqglbhfwjxms", //Password generated after two step verification og google (or this pwd is given by google)
    },
    // === add this === //
    tls: { rejectUnauthorized: false },
  });

  const mailOptions = {
    from: "twinkleu455@gmail.com",
    to: email,
    subject: "Sending Email For password Reset",
    text: "You can Reset Your Password here by clicking the link given below", // plain text body
    html: `Hello,<br> Please Click on the link to recover your password.<br><a href=http://localhost:3000/api/recoverPass/${user._id}>Click here to verify</a>`, // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("error", error);
      res.status(401).json({ status: 401, message: "email not send" });
    } else {
      console.log("Email sent", info.response);
      res.status(201).json({ status: 201, message: "Email sent Succsfully" });
    }
  });
  /*async function sendMail() {
    //connect with smtp
    let transporter = nodemailer.createTransport({
      host: "satyakabir.com",
       port: 465,
      secure: true, // true for 465, false for other ports
      service: "gmail",
      auth: {
        //user: "info@habooda.com",
       // pass: "@aAhb2022",
        user: "laila.cassin@ethereal.email",
        pass: "kSq8aaEvjg7Ts6ZESn",
      
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Fred Foo 👻" <twinkleu455@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "Hello,<br> Please Click on the link to recover your password.<br><a href='http://localhost:3000/api/recoverPass/${user._id}'>Click here to verify</a>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    await res.json({
      token1,
      token1_expiresIn: "120s",
      message: "link sent",
    });
  }
  sendMail().catch(console.error);
  //console.log(transporter);*/
};

// exports.forgotPwdUserVerify = async (req, res) => {
//   console.log("hii");
//   const userid = req.params.id;
//   const result = await User.findOne({ _id: userid });
//   if (!result) {
//     return res.status(400).json({ message: "User Not Exist" });
//   } else {
//     return res.status(200).json(result);
//   }
// };

// exports.resetPassword = async (req, res) => {
//   const userid = req.params.id;
//   const { newPwd } = req.body;
//   const result = await User.findOne({ _id: userid });
//   console.log("result", result.salt);
//   if (!result) {
//     return res.status(400).json({ message: "User Not Exist" });
//   } else {
//     const forgotpass = crypto
//       .createHmac("sha256", result.salt)
//       .update(newPwd)
//       .digest("hex");
//     const finalPwd = await User.findByIdAndUpdate(
//       { _id: userid },
//       { encry_password: forgotpass },
//       { new: true }
//     );
//     return res.status(200).json(finalPwd); // {message: "Password Updated Successfully" },
//   }
// };

// ******************** signout *************************
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout",
  });
};

// **************** protected Routes ****************************
exports.issignedIn =
  // JWT({
  //   secret: process.env.SECRET_KEY,
  //   userProperty: "auth",
  //   algorithms: ["HS256"],
  //});

  // ******************* custom Middlewares ************************
  exports.isAuthenticated = (req, res, next) => {
    // var checked = req.profile && req.auth && req.profile._id == req.auth._id;
    // console.log(req.profile);
    // console.log(req.auth);
    // console.log(checked);
    // if (!checked) {
    //   res.status(403).json({
    //     error: "ACCESS DENIED",
    //   });
    // }
    // next();
  };

// ******************* adminSignup ************************
exports.adminSignup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()[0].msg,
    });
  }

  if (req.body.phoneNo.length < 10) {
    return res.status(400).json({
      error: "Enter a valid 10 digit number",
    });
  }
  try {
    const { firstName, email, password, phoneNo, role } = req.body;
    const user = new User({ firstName, email, password, phoneNo, role });

    await user.save();

    // await Cart.create({ user: user._id });
    // await WishList.create({ user: user._id });
    console.log("user", user);
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNo: user.phoneNo,
      role: user.role,
    });
  } catch (err) {
    console.log("err", err);
    if (err.code === 11000) {
      const fieldName = err.keyValue.phoneNo ? "Phone no" : "Email";
      return res.status(400).json({
        error: `${fieldName} already in use`,
      });
    }
    return res.status(400).json({
      error: "An error occurred while signing up",
    });
  }
};

// ******************* adminSignin************************
exports.adminSignin = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()[0].msg,
    });
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(400)
      .json({ message: "No User Found! Create a Account." });
  }

  if (!user.authenticate(req.body.password)) {
    return res.status(400).json({ message: "password didnot match" });
  }

  // if(user.tokens != '') {
  //     return res.status(422).json({
  //         error:'Email not verified yet!'
  //     })
  // };

  const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);

  res.cookie("token", token, { expire: new Date() + 9999 });

  //res to front-end
  const { _id, firstName, role, email } = user;
  return res.json({ token, user: { _id, firstName, role, email } });
};

// ******************* isAdmin************************

exports.isAdmin = async (req, res, next) => {
  var authHeader = req.headers.authorization;
  //console.log(authHeader);
  if (!authHeader)
    return res
      .status(401)
      .json({ success: false, error: "Authorization Required" });

  var token = authHeader.split(" ")[1];
  const decode = jwt.verify(token, process.env.SECRET_KEY);
  const user = await User.findOne({
    _id: decode._id,
  });
  if (!user) {
    return res
      .status(401)
      .json({ success: false, error: "Please Authenticate" });
  } else {
    console.log("admin user received");
  }

  // if (req.body.role >= res.PersonalDetails.role)
  // return res.status(401).json({success: false, error:"Access Denied"});


  // if (user.role < 2)
  //   return res.status(401).json({ success: false, error: "You Are Not Admin" });
  if (user.role != 1) return res.status(401).json({ success: false, error: "You Are Not Admin" });

  req.token = token;
  req.profile = user;

  next();
};

// ******************* isUser************************

exports.isUser = async (req, res, next) => {
  var authHeader = req.headers.authorization;
  if (!authHeader)
    return res
      .status(401)
      .json({ success: false, error: "Authorization Required" });

  var token = authHeader.split(" ")[1];
  const decode = jwt.verify(token, process.env.SECRET_KEY);
  // if(!decode) return res.json({success:false, error:'Token Is Incorrect'})
  const user = await User.findOne({
    _id: decode._id,
  });

  if (!user) {
    return res
      .status(401)
      .json({ success: false, error: "Please Authenticate" });
  }

  if (user.role != 0)
    return res.status(401).json({ success: false, error: "You Are Not User" });

  req.token = token;
  req.profile = user;

  next();
};

// ****************** verify ***********************

exports.verifyUser = async (req, res) => {
  const userId = req.profile._id;

  try {
    const user = await User.findById(userId); // Find the user by ID

    if (user.isVerify) {
      return res.json({ msg: "Already Verified" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, {
      isVerified: true,
    });
    if (!updatedUser) {
      return res.status(400).json({ message: "User Not Found" });
    } else {
      // Create a new Cart and WishList for the verified user
      const cart = await Cart.create({ user: updatedUser._id });
      const wishList = await WishList.create({ user: updatedUser._id });
      return res.json({
        user: "User verified successfully",
        data: { updatedUser, cart, wishList },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Failed to verify user" });
  }
};

// ****************** Block User***********************

exports.blockUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const blockUser = await User.findByIdAndUpdate(userId, {
      isDisabled: true,
    });
    if (!blockUser) {
      return res.status(500).json({ message: "User is not blocked" });
    } else {
      return res.status(200).json({ message: "User Blocked" });
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

// ****************** Unblock User***********************

exports.unblockUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const unblockUser = await User.findByIdAndUpdate(userId, {
      isDisabled: false,
    });
    if (!unblockUser) {
      return res.status(500).json({ message: "User is not unblocked" });
    } else {
      return res.status(200).json({ message: "User Unblocked" });
    }
  } catch (error) {
    throw new Error(error);
  }
};
