const Products = require("../models/Product");

exports.searchController = async (req, res) => {
  const searchItem = await Products.find({
    $or: [
      { name: { $regex: req.params.key } },
      { description: { $regex: req.params.key } },
      { composition: { $regex: req.params.key } },
      { brand: { $regex: req.params.key } },
      { color: { $regex: req.params.key } },
    ],
  });

  res.json({
    status: true,
    message: `Search`,
    data: searchItem,
  });
};
