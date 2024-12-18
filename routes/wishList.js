const express = require("express");
const {
  issignedIn,
  isAuthenticated,
  isAdmin,
  isUser,
} = require("../controllers/auth");
const { getproductbyId } = require("../controllers/product");
const { getuserbyId } = require("../controllers/user");
const { body, validationResult, oneOf } = require("express-validator");
const {
  createWishList,
  getUserWishlist,
  getAllWishlist,
  deleteUserWishlist,
  getproductinsideUserWishlist,
} = require("../controllers/wishList");
const router = express.Router();

router.param("userId", getuserbyId);

router.param("productId", getproductbyId);

router.post(
  "/wishlist/create",
  [body("item", "item id is required").notEmpty()],
  //   issignedIn,
  //   isAuthenticated,
  isUser,
  createWishList
);

router.get(
  "/userWishlist",
  //   issignedIn,
  //   isAuthenticated,
  isUser,
  getUserWishlist
);

router.get(
  "/userProductonWishlist/:productId",
  //   issignedIn,
  //   isAuthenticated,
  isUser,
  getproductinsideUserWishlist
);

router.get(
  "/allWishlists",
  //   issignedIn,
  //   isAuthenticated,
  isAdmin,
  getAllWishlist
);

router.delete(
  "/userWishList/:productId",
  //   issignedIn,
  //   isAuthenticated
  isUser,
  deleteUserWishlist
);

module.exports = router;
