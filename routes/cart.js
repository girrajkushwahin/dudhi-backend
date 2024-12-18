const express = require("express");
const {
  issignedIn,
  isAuthenticated,
  isAdmin,
  isUser,
} = require("../controllers/auth");
const {
  createCart,
  getAllCart,
  updateCart,
  getYourCart,
  deleteCart,
} = require("../controllers/cart");
const { getproductbyId } = require("../controllers/product");
// const { getuserbyId } = require("../controllers/user");
const router = express.Router();

// router.param("userId", getuserbyId);

// router.param("productId", getproductbyId);

router.post("/cart/create", isUser, createCart);

router.patch("/cart/update/:productId", isUser, updateCart);

router.get("/getYourCart", isUser, getYourCart);

// router.get("/getAllCart", isAdmin, getAllCart);

router.delete("/cart/delete/:productId", isUser, deleteCart);

module.exports = router;
