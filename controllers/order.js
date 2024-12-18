const Order = require("../models/Orders");
const Product = require("../models/Product");
//const SellerShop = require("../models/sellerShop");
const Cart = require("../models/Cart");

exports.getorderbyId = async (req, res, next, id) => {
  const order = await Order.findById(id).populate("products.item");

  if (!order) {
    return res.status(402).json({ success: false, message: "order not found" });
  } else {
    // console.log(order);
    req.order = order;
    next();
  }
};

// **************** createOrder *****************

exports.createOrder = async (req, res) => {
  const { products, address, transaction, Bill_Amount, Payment_mode } =
    req.body;
  if (!products || !address || !transaction || !Bill_Amount || !Payment_mode) return res.status(422).json({ success: 'false', message: 'Enter valid data' })
  else {
    const order = await Order.create({
      products: products,
      address: address,
      transaction: transaction,
      Payment_mode: Payment_mode,
      Bill_Amount: Bill_Amount,
      user: req.profile._id,
    });
    if (!order) {
      return res
        .status(400)
        .json({ success: false, message: "No orders to generate" });
    } else {
      return res.status(200).json({
        success: true,
        message: "Order Generated Successfully",
        order: order,
      });
    }
  }
};

// // **************** getOrder *****************

exports.getOrder = async (req, res) => {
  const order = await Order.find({ user: req.profile._id }).populate(
    "products.item"
  );
  if (!order) {
    return res.status(400).json({ success: false, message: "No Orders Found" });
  } else {
    return res.status(200).json({ success: true, data: order });
  }
};

// // **************** getAllOrder *****************

exports.getAllOrder = async (req, res) => {
  const order = await Order.find().populate("user", "products.item");
  // console.log(order);
  if (!order) {
    return res
      .status(400)
      .json({ success: false, message: "Orders Not Found" });
  } else {
    return res.status(200).json({ success: true, data: order });
  }
};

// ***************** getOrderStatus *****************

// exports.getOrderStatus = (req, res) => {
//   res.json(Order.schema.path("status").enumValues);
//   // res.json(Order.schema.path("products.status").enumValues);
// };

// *************** Improvise OrderStatus By Seller ****************

// exports.updateOrderStatus = (req,res) => {

//     SellerShop.findOneAndUpdate(
//         {userId:req.profile._id, 'orders.orderId': req.params.orderId},
//         {$set:{
//             'orders.$.status':req.body.status
//         }},
//         async(err, order) => {
//             if(err) {
//                 return res.status(400).json({success:false, error:'order status not updated in DB'})
//             }
//             await order.orders.map((item) => {
//                 if(item.orderId == req.params.orderId) {
//                       req.customerId = item.customerId;
//                 } else {
//                     return
//                 }
//             })
//             await Order.updateOne(
//                 {user:req.customerId, 'products._id': req.params.orderId},
//                 {$set:{
//                     'products.$.status':'Shipped'
//                 }},
//                 (err, order) => {
//                 if(err) {
//                     return res.status(400).json({success:false, error:'order status not updated in DB'})
//                 }
//                 return res.json({success:true, message:`Order status updated successfully`, order:order})
//                 }
//             )
//         }
//     )

// }

// exports.sendOrderToSeller = (req, res, next) => {
//   if (req.body.success == true) {
//     let sellerOperations = req.order.products.map((item) => {
//       return {
//         updateOne: {
//           filter: { _id: item.item.sellerId },
//           update: {
//             $push: {
//               orders: {
//                 orderId: item._id,
//                 item: item.item,
//                 qty: item.qty,
//                 size: item.size,
//                 price: item.price,
//                 discount: item.discount,
//                 status: req.body.status,
//                 userAddress: req.order.address,
//                 customerId: req.order.user,
//               },
//             },
//           },
//           upsert: true,
//         },
//       };
//     });

//     SellerShop.bulkWrite(sellerOperations, {}, (err, products) => {
//       if (err) {
//         return res
//           .status(400)
//           .json({ success: false, error: "Bulk Operation Failed" });
//       }
//       next();
//     });
//   } else {
//     next();
//   }
// };

// Update Product Order Status if Payment Done or success true

exports.updateStatusAfterPayment = async (req, res, next) => {
  const orderId = req.params.orderId;
  const order = await Order.findById(orderId);

  if (req.body.success) {
    // console.log(req.body.success);
    let myOperations = order.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: orderId, "products._id": item._id },
          update: {
            $set: {
              "products.$.status": req.body.status,
            },
          },
        },
      };
    });

    const updatedOrder = await Order.bulkWrite(myOperations, {});

    // console.log(updatedOrder);

    if (!updatedOrder) {
      return res
        .status(400)
        .json({ success: false, error: "Bulk Operation Failed" });
    } else {
      next();
    }
  } else {
    next();
  }
};

// update stock and sold fields
exports.updateStockAndSold = async (req, res, next) => {
  const orderId = req.params.orderId;
  const order = await Order.findById(orderId);

  if (req.body.success == "true") {
    let myOperations = order.products.map((item) => {
      // console.log(item);
      return {
        updateOne: {
          filter: { _id: item.item._id },
          update: {
            $inc: {
              stock: -item.qty,
              sold: +item.qty,
            },
          },
        },
      };
    });
    // console.log(myOperations);

    const result = await Product.bulkWrite(myOperations, {});
    if (!result) {
      return res
        .status(400)
        .json({ success: false, error: "Bulk Operation Failed" });
    } else {
      next();
    }
  } else {
    next();
  }
};

exports.clearCart = async (req, res, next) => {
  if (req.body.success == "true") {
    const result = await Cart.updateOne(
      { user: req.profile._id },
      { $set: { products: [] } }
    );
    if (!result) {
      return res
        .status(400)
        .json({ success: false, error: "cannot remove item" });
    } else {
      next();
    }
  } else {
    next();
  }
};

// // *************** updateOrder ****************

exports.updateOrder = async (req, res) => {
  const orderId = req.params.orderId;
  const order = await Order.updateOne(
    { _id: orderId },
    {
      $set: {
        // transaction: req.body.transaction,
        transaction: req.body.transaction,
        Payment_mode: req.body.Payment_mode,
      },
    }
  );
  if (!order) {
    return res
      .status(400)
      .json({ success: false, error: "order not updated in DB" });
  } else {
    return res.status(200).json({
      success: true,
      message: "Order Updated Successfully",
      data: order,
    });
  }
};

//*************** Improvise OrderStatus By Admin ****************

exports.improviseOrderStatus = async (req, res) => {
  const orderId = req.params.orderId;
  //console.log(orderId);
  const itemId = req.params.itemId;

  const order = await Order.updateOne(
    { _id: orderId, "products._id": itemId },
    {
      $set: {
        "products.$.status": req.body.status,
      },
    }
  );
  // console.log(order);
  if (!order) {
    return res
      .status(400)
      .json({ success: false, error: "order status not updated in DB" });
  } else {
    return res.status(200).json({
      success: true,
      message: `Order status updated successfully`,
      order: order,
    });
  }
};
