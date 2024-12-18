// const express = require("express");
// const { issignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
// const {
//   getnewArrivalbyId,
//   getNewArrival,
//   createNewArrival,
//   deleteNewArrival,
//   getAllNewArrivals,
// } = require("../controllers/newArrival");
// const { getuserbyId } = require("../controllers/user");
// const router = express.Router();

// router.param("userId", getuserbyId);

// router.param("newArrivalId", getnewArrivalbyId);

// router.get("/allNewArrivals", getAllNewArrivals);

// router.get("/newArrival/:newArrivalId", getNewArrival);

// router.post(
//   "/newArrival/create",
//   //  issignedIn, isAuthenticated,
//   isAdmin,
//   createNewArrival
// );

// router.delete(
//   "/newArrival/delete/:newArrivalId",
//   //   issignedIn,
//   //   isAuthenticated,
//   isAdmin,
//   deleteNewArrival
// );

// module.exports = router;
