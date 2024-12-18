// const Arrivals = require("../models/NewArrivals");

// //POST NEW ARRIVAL
// exports.createNewArrival = async (req, res) => {
//   const product = await Arrivals.create(req.body);
//   if (!product) {
//     return res
//       .status(400)
//       .json({ success: false, message: "No Products Added" });
//   } else {
//     res.status(200).json({ success: true, product: product });
//   }
// };

// //PARAM getProductbyId
// exports.getnewArrivalbyId = async (req, res, next, id) => {
//   const product = await Arrivals.findById(id);
//   if (!product) {
//     return res
//       .status(400)
//       .json({ success: false, message: "products not found" });
//   } else {
//     req.NewArrival = product;
//     next();
//   }
// };

// //GET getSingleProductById
// exports.getNewArrival = async (req, res) => {
//   const product = await Arrivals.findOne({ _id: req.NewArrival._id }).populate({
//     path: "product",
//   });

//   if (!product) {
//     return res
//       .status(400)
//       .json({ success: false, message: "No product found" });
//   } else {
//     return res.json({ success: true, data: product });
//   }
// };

// //GET getAllProducts
// exports.getAllNewArrivals = async (req, res) => {
//   const products = await Arrivals.find().populate({ path: "product" });

//   if (!products) {
//     return res
//       .status(400)
//       .json({ success: false, message: "No Products found" });
//   } else {
//     return res.json({ success: true, data: products });
//   }
// };

// //DELETE SingleProduct
// exports.deleteNewArrival = async (req, res) => {
//   const deletedProduct = await Arrivals.deleteOne({ _id: req.NewArrival._id });
//   if (!deletedProduct) {
//     return res.status(400).json({ success: false, error: "not in db" });
//   } else {
//     return res.json({ success: true, message: "Succesfully delted from list" });
//   }
// };
