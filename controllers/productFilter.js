const Product = require("../models/Product");

// exports.getProductsByColor = async (req, res) => {
//   const product = await Product.find({
//     color: { $regex: req.params.colorName },
//   });

//   if (!product) {
//     return res
//       .status(400)
//       .json({ success: false, error: "no products with same color found" });
//   } else {
//     return res.json({ success: true, data: product });
//   }
// };

// exports.getProductsByComposition = async (req, res) => {
//   const product = await Product.find({
//     composition: { $regex: req.params.composition },
//   });
//   if (!product) {
//     return res.status(400).json({
//       success: false,
//       error: "no products with same composition found",
//     });
//   } else {
//     return res.json({ success: true, data: product });
//   }
// };

// exports.getProductsBySize = async (req, res) => {
//   const product = await Product.find({ size: { $regex: req.params.size } });
//   if (!product) {
//     return res
//       .status(400)
//       .json({ success: false, error: "no products with same size found" });
//   } else {
//     return res.json({ success: true, data: product });
//   }
// };

// exports.getProductsByBrand = async (req, res) => {
//   const product = await Product.find({ brand: { $regex: req.params.brand } });
//   if (!product) {
//     return res
//       .status(400)
//       .json({ success: false, error: "no products with same brand found" });
//   } else {
//     return res.json({ success: true, data: product });
//   }
// };

exports.getProductsByPrice = async (req, res) => {
  const product = await Product.aggregate([
    {
      $match: {
        $or: [
          {
            buyingPrice: {
              $gte: parseInt(req.params.minPrice),
              $lte: parseInt(req.params.maxPrice),
            },
          },
        ],
      },
    },
  ]);
  if (!product) {
    return res
      .status(400)
      .json({ success: false, error: "no products with same Price Range" });
  } else {
    return res.json({ success: true, data: product });
  }
};
