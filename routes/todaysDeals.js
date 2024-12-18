// const express = require("express");
// const { issignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
// const {
//   getnewtodaydealbyId,
//   getAllTodayDeals,
//   getSingleTodayDeal,
//   createNewTodayDeal,
//   deleteTodayDeal,
//   updateTodayDeal,
// } = require("../controllers/todaysDeals");
// const { getuserbyId } = require("../controllers/user");
// const router = express.Router();

// router.param("userId", getuserbyId);

// router.param("newtodaydealbyId", getnewtodaydealbyId);

// router.get("/allTodayDeals", getAllTodayDeals);

// router.get("/singleTodayDeal/:newtodaydealbyId", getSingleTodayDeal);

// router.post(
//   "/newTodayDeal/create",
//   //  issignedIn, isAuthenticated,
//   isAdmin,
//   createNewTodayDeal
// );

// router.patch(
//   "/todayDeal/update/:newtodaydealbyId",
//   // issignedIn, isAuthenticated,
//   isAdmin,
//   updateTodayDeal
// );

// router.delete(
//   "/todayDeal/delete/:newtodaydealbyId",
//   //issignedIn, isAuthenticated,
//   isAdmin,
//   deleteTodayDeal
// );

// module.exports = router;
