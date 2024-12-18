// const TodayDeals = require("../models/todaysDeals");
// // const { get } = require("../routes/cart");

// //POST NEW TodayDeal
// exports.createNewTodayDeal = async (req, res) => {
//   const todayDeal = await TodayDeals.create(req.body);
//   if (!todayDeal) {
//     return res
//       .status(400)
//       .json({ success: false, message: "No Products Added" });
//   } else {
//     return res.status(200).json({ success: true, todayDeal: todayDeal });
//   }
// };

// //PARAM getnewtodaydealbyId
// exports.getnewtodaydealbyId = async (req, res, next, id) => {
//   const product = await TodayDeals.findById(id);
//   if (!product) {
//     return res
//       .status(400)
//       .json({ success: false, error: "products not found" });
//   } else {
//     req.NewTodayDeal = product;
//     next();
//   }

//   //   .exec((err, product) => {
//   //     if (err) {
//   //       return res
//   //         .status(400)
//   //         .json({ success: false, error: "products not found" });
//   //     }
//   //     req.NewTodayDeal = product;
//   //     next();
//   //   });
// };

// //GET getSingleTodayDealById
// exports.getSingleTodayDeal = async (req, res) => {
//   const product = await TodayDeals.findOne({
//     _id: req.NewTodayDeal._id,
//   }).populate({ path: "product" });
//   if (!product) {
//     return res
//       .status(400)
//       .json({ success: false, message: "No Product Found" });
//   } else {
//     return res.json({ success: true, product: product });
//   }
//   // .exec((err, product) => {
//   //   if (err) {
//   //     return res
//   //       .status(400)
//   //       .json({ success: false, error: "No Product Found" });
//   //   }
//   //   res.json({ success: true, product: product });
//   // });
// };

// //GET getAllTodayDeals
// exports.getAllTodayDeals = async (req, res) => {
//   const getTodaydeals = await TodayDeals.find().populate({ path: "product" });

//   if (!getTodaydeals) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Add a product first" });
//   } else {
//     return res.status(200).json({ success: true, products: getTodaydeals });
//   }
// };

// //UPDATE TodayDeal
// exports.updateTodayDeal = async (req, res) => {
//   const updatedTodaydeal = await TodayDeals.findByIdAndUpdate(
//     { _id: req.NewTodayDeal._id },
//     { $set: { price: req.body.price, discount: req.body.discount } },
//     { new: true, useFindAndModify: false }
//   );
//   if (!updatedTodaydeal) {
//     return res.status(400).json({ success: false, message: "Not updated" });
//   } else {
//     return res.json({ success: true, updatedTodaydeal: updatedTodaydeal });
//   }
// };

// //DELETE SingleProduct
// exports.deleteTodayDeal = async (req, res) => {
//   const deletedTodatdeal = await TodayDeals.deleteOne({
//     _id: req.NewTodayDeal._id,
//   });
//   if (!deletedTodatdeal) {
//     return res.status(400).json({ success: false, message: "Not in db" });
//   } else {
//     return res
//       .status(200)
//       .json({ success: true, message: "Deleted Successfully" });
//   }

//   //      (err, product) => {
//   //     if (err) {
//   //       return res.status(400).json({ success: false, error: "not in db" });
//   //     }
//   //     return res.json({
//   //       success: true,
//   //       message: "Succesfully deleted from list",
//   //     });
//   //   });
// };
