const express = require("express");
// const { issignedIn, isAuthenticated, isUser } = require("../controllers/auth");
const router = express.Router();
const {
  getuserbyId,
  updateId,
  getUser,
  getAllUser,
  tokenId,
  changePassword,
} = require("../controllers/user");

router.param("userId", getuserbyId);

router.get("/user/:userId", getUser);

router.get("/users", getAllUser);

router.patch(
  "/updateuser/:userId",
  // issignedIn,
  // isAuthenticated,
  // isUser,
  updateId
);

router.put(
  "/changePassword",
  //tokenId ,
  // isUser,
  changePassword
);

module.exports = router;
