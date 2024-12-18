const express = require("express");
const router = express.Router();
const { body, validationResult, oneOf } = require("express-validator");
const {
  signup,
  getUserbyId,
  verifyUser,
  socialLogin,
  signin,
  forgotPassword,
  signout,
  forgotPwdUserVerify,
  resetPassword,
  adminSignup,
  adminSignin,
  blockUser,
  unblockUser,
} = require("../controllers/auth");
/*const {
  getUserbyId,
  verifyUser,
  signin,
  signup,
  socialLogin,
} = require("../controllers/auth");*/

router.post(
  "/signup",
  [
    body("firstName", "name is required").notEmpty(),
    body("email", "email is required").isEmail(),
    body("password", "password is required").notEmpty(),
    body("password", "min length of 3 is required for Password").isLength({
      min: 3,
    }),
  ],
  signup
);

router.post(
  "/signin",
  [
    oneOf([
      body("email", "email is required").isEmail(),
      body("phoneNo", "Phone no is required").isNumeric(),
    ]),
    body("password", "password is required").notEmpty(),
    body("password", "min length of 3 is required for Password").isLength({
      min: 3,
    }),
  ],
  signin
);

router.post(
  "/adminSignup",
  [
    body("firstName", "name is required").notEmpty(),
    body("email", "email is required").isEmail(),
    body("password", "password is required").notEmpty(),
    body("role", "role is required").notEmpty(),
    body("password", "min length of 3 is required for Password").isLength({
      min: 3,
    }),
  ],
  adminSignup
);

router.post(
  "/adminSignin",
  [
    oneOf([
      body("email", "email is required").isEmail(),
      body("phoneNo", "Phone no is required").isNumeric(),
    ]),
    body("password", "password is required").notEmpty(),
    body("role", "role is required").notEmpty(),
    body("password", "min length of 3 is required for Password").isLength({
      min: 3,
    }),
  ],
  adminSignin
);

router.post("/socialLogin", socialLogin);

router.param("verifyUserbyId", getUserbyId);

router.post("/verify/:verifyUserbyId", verifyUser);

router.post("/forgotPass", forgotPassword);

//router.get("/forgotPass/:id", forgotPwdUserVerify);

//router.patch("/resetPass/:id", resetPassword);

router.post("/signout", signout);

router.patch("/block-user/:userId", blockUser);

router.patch("/unblock-user/:userId", unblockUser);

module.exports = router;

// ************************************
