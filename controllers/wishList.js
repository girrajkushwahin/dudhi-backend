const WishList = require("../models/WishList");
const { body, validationResult } = require("express-validator");

exports.createWishList = async (req, res) => {
  const { item } = req.body;
  console.log(req.body);

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()[0].msg,
      });
    }
    const cart = await WishList.updateOne(
      { user: req.profile._id, "products.item": { $ne: item } }, // Query parameter//here we are pushing the product in the wishlist only in case if it is not already in the wishlist
      {
        $push: { products: { item: item } },
      }
    );
    if (!cart) {
      return res
        .status(400)
        .json({ success: false, error: "Product not added to cart" });
    } else {
      res.json({ success: true, item: item });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getUserWishlist = async (req, res) => {
  const wishlist = await WishList.findOne({ user: req.profile._id }).populate(
    "products.item"
  );
  if (!wishlist) {
    return res.status(400).json({ success: false, message: "wishlist empty" });
  } else {
    return res.json({ success: true, data: wishlist.products });
  }
};

exports.getproductinsideUserWishlist = async (req, res) => {
  //In this api we are retriving the specific product from the wishlist
  const productId = req.params.productId;
  const wishlistProduct = await WishList.findOne(
    { user: req.profile._id },
    { products: { $elemMatch: { item: productId } } }
  ).populate("products.item");
  if (!wishlistProduct) {
    return res.status(400).json({ success: false, error: "wishList empty" });
  } else {
    return res.json({ success: true, data: wishlistProduct });
  }
};

exports.getAllWishlist = async (req, res) => {
  const allWishlists = await WishList.find().populate("products");
  console.log(allWishlists);
  if (!allWishlists) {
    return res
      .status(400)
      .json({ success: false, message: "No wishlist found" });
  } else {
    return res.json({ success: true, data: allWishlists });
  }
};

exports.deleteUserWishlist = async (req, res) => {
  const productId = req.params.productId;
  if ("") {
    return res.status(402).json({
      err: "No cart in db",
    });
  }
  const wishlist = await WishList.updateOne(
    { user: req.profile._id },
    { $pull: { products: { item: productId } } }
  );
  if (!wishlist) {
    return res
      .status(400)
      .json({ success: false, message: "cannot remove item" });
  } else {
    return res
      .status(200)
      .json({ success: true, message: "product removed successfully" });
  }
};
