const express = require("express");
const router = express.Router();
const {
  getAllOrder,
  createOrder,
  getOrderStatus,
  updateOrder,
  getOrder,
  improviseOrderStatus,
  updateStockAndSold,
  sendOrderToSeller,
  clearCart,
  updateStatusAfterPayment,
  updateOrderStatus,
  getorderbyIde,
} = require("../controllers/order");
const {
  //   issignedIn,
  //   isAuthenticated,
  isUser,
  isAdmin,
  isVendor,
} = require("../controllers/auth");
const { getuserbyId } = require("../controllers/user");
const { getorderbyId } = require("../controllers/order");

// params
router.param("userId", getuserbyId);

router.param("orderId", getorderbyId);

// create order by User
router.post("/order/create", isUser, createOrder);

// // get single Order User
router.get("/order/get", isUser, getOrder);

// //get All Orders ADMIN
router.get(
  "/order/getAll",
  //   issignedIn,
  //   isAuthenticated,
  isAdmin,
  getAllOrder
); // here admin is getting orders of all users

// getOrderStatus ADMIN
// router.get(
//   "/order/status/:userId/:orderId",
//   //   issignedIn,
//   //   isAuthenticated,
//   isAdmin,
//   getOrderStatus
// );

// // updateOrder USER
router.put(
  "/order/user/UpdateOrder/:orderId",
  // issignedIn,
  // isAuthenticated,
  isUser,
  updateStatusAfterPayment,
  updateStockAndSold,
  //   sendOrderToSeller,
  clearCart,
  updateOrder
);

//updateOrderStatus by Seller
// router.put('/order/seller/updateOrderStatus/:userId/:orderId', issignedIn, isAuthenticated, isVendor, updateOrderStatus)

// updateOrderStatus by ADMIN
router.put(
  "/order/admin/UpdateOrderStatus/:itemId/:orderId",
  //   issignedIn,
  //   isAuthenticated,
  isAdmin,
  improviseOrderStatus
);

module.exports = router;
