const Cart = require("../models/Cart");

exports.createCart = async (req, res) => {
  const { productId, price, discount, size, color, quantity } = req.body;
  if (!productId || !price || !discount || !size || !color || !quantity) return res.status(422).json({ success: 'false', message: 'Enter valid data' })

  else {
    const checkCart = await Cart.findOne({ user: req.profile._id })
    if (!checkCart) {
      const status = await Cart.create({ user: req.profile._id, products: [{ item: productId, price, qty: quantity, color, discount, size }] })
      if (status) return res.status(200).json({ success: 'true', message: 'Added to cart' })
      else return res.status(500).json({ success: 'false', message: 'Internal error' })
    } else {
      const status = await Cart.updateOne({ user: req.profile._id }, {
        $push: {
          products: { item: productId, price, qty: quantity, color, discount, size }
        }
      })
      if (status) return res.status(201).json({ success: 'true', message: 'Added to cart' })
      else return res.status(500).json({ success: 'false', message: 'Internal error' })
    }
  }

  // const productData = {
  //   item: product._id,
  //   buyingPrice: price,
  //   discount: discount,
  //   size: size,
  //   color: color,
  // };

  // if (quantity == undefined || !quantity) {
  //   try {
  //     const cart = await Cart.updateOne(
  //       { user: req.profile._id, "products.item": { $ne: productData.item } }, // Query parameter
  //       {
  //         $push: {
  //           products: {
  //             item: productData.item,
  //             price: productData.buyingPrice,
  //             size: productData.size,
  //             color: productData.color,
  //             discount: productData.discount,
  //           },
  //         },
  //       }
  //     );
  //     if (!cart) {
  //       return res
  //         .status(400)
  //         .json({ success: false, error: "Product already in cart" });
  //     } else {
  //       return res.json({ success: true, data: cart });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // } else {
  //   try {
  //     const cart = await Cart.updateOne(
  //       { user: req.profile._id, "products.item": { $ne: productData.item } }, // Query parameter
  //       {
  //         $push: {
  //           products: {
  //             item: productData.item,
  //             price: productData.buyingPrice,
  //             size: productData.size,
  //             color: productData.color,
  //             discount: productData.discount,
  //             qty: quantity,
  //           },
  //         },
  //       }
  //     );
  //     if (!cart) {
  //       return res
  //         .status(400)
  //         .json({ success: false, error: "Product already in cart" });
  //     } else {
  //       return res.json({ success: true, data: cart });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
};

exports.updateCart = async (req, res) => {
  const { quantity } = req.body;
  const productid = req.params.productId;
  // console.log(product);

  try {
    const cart = await Cart.updateOne(
      { user: req.profile._id, "products.item": productid }, // Query parameter
      {
        $set: {
          "products.$.qty": quantity,
          // "products.$.price": product.buyingPrice * quantity,
          // "products.$.price": isNaN(price) ? 0 : price * quantity,
        },
      }
    );

    if (!cart) {
      return res
        .status(400)
        .json({ success: false, error: "First add a product" });
    } else {
      return res.status(200).json({ success: true, data: cart });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getYourCart = async (req, res) => {

  const cart = await Cart.findOne({ user: req.profile._id }).populate(
    "products.item"
  );

  if (!cart) {
    return res.status(400).json({ success: false, message: "cart empty" });
  } else {
    return res.status(200).json({ success: true, data: cart.products });
  }
};

// exports.getAllCart = async (req, res) => {
//   const cart = Cart.find().populate("products");
//   if (!cart) {
//     return res.status(400).json({ success: false, message: "No cart found" });
//   } else {
//     return res.status(200).json({ success: true, data: cart });
//   }
// };

// exports.getAllCart = async (req, res) => {
//   try {
//     const carts = await Cart.find().populate("products");
//     if (!carts) {
//       return res
//         .status(400)
//         .json({ success: false, message: "No carts found" });
//     } else {
//       const filteredCarts = carts.map((cart) => ({
//         _id: cart._id,
//         products: cart.products,
//         user: cart.user,
//         // Include other desired fields from the cart object
//       }));
//       return res.status(200).json({ success: true, data: filteredCarts });
//     }
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ success: false, message: "Internal server error" });
//   }
// };

exports.deleteCart = async (req, res) => {
  const productId = req.params.productId;
  // if ("") {
  //   return res.status(402).json({
  //     err: "No cart in db",
  //   });
  // }
  const removedProduct = await Cart.updateOne(
    { user: req.profile._id },
    { $pull: { products: { item: productId } } }
  );

  if (!removedProduct) {
    return res
      .status(400)
      .json({ success: false, message: "cannot remove item" });
  } else {
    return res.status(200).json({ success: true, data: removedProduct });
  }
  //   (err, item) => {
  //     if (err) {
  //       return res
  //         .status(400)
  //         .json({ success: false, error: "cannot remove item" });
  //     }
  //     res.json({ success: true, message: "item removed successfully" });
  //   }
  // );
};
