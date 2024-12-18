const express = require("express");
const {
  createAddress,
  getAddress,
  deleteAddress,
  updateAddress,
  getaddressbyId,
  getAllAddress,
  setdefaultAddress,
  setOtherAddressAsNotDefault,
  getAllAddressOfUserByUserId,
} = require("../controllers/address");
const {
  issignedIn,
  isAuthenticated,
  isUser,
  isAdmin,
} = require("../controllers/auth");
const { getuserbyId } = require("../controllers/user");
const router = express.Router();

router.param("userId", getuserbyId);

//router.param("addressId", getaddressbyId);

router.post(
  "/address/:userId",
  // issignedIn,
  // isAuthenticated,
  isUser,
  createAddress
);

router.get(
  "/getAddress/:userId",
  // issignedIn,
  // isAuthenticated,
  isUser,
  getAddress
);

router.get(
  "/getAllAddress/:userId",
  //  issignedIn,
  //  isAuthenticated,
  isAdmin,
  getAllAddress
);

router.put(
  "/updateAddress/:addressId",
  //   issignedIn,
  //   isAuthenticated,
  isUser,
  updateAddress
);

router.put(
  "/updateDefaultAddress/:singleAddressId",
  isUser,
  getAllAddressOfUserByUserId,
  setOtherAddressAsNotDefault,
  setdefaultAddress
);

router.delete(
  "/deleteAddress/:addressId",
  //   issignedIn,
  //   isAuthenticated,
  isUser,
  deleteAddress
);

module.exports = router;
