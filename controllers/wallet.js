// const Wallet = require("../models/wallet");

// exports.createUserWallet = async (req, res) => {
//   const userwallet = await Wallet.create(req.body);
//   if (!userwallet) {
//     return res
//       .status(400)
//       .json({ success: false, error: "wallet did not created" });
//   } else {
//     return res.status(200).json({
//       success: true,
//       message: "Wallet created successfully  !! wait for verification",
//       data: userwallet,
//     });
//   }
// };

// exports.getUserWallet = async (req, res) => {
//   const userwallet = await Wallet.findOne({ user: req.profile._id });
//   //console.log(userwallet);
//   if (!userwallet) {
//     return res.status(400).json({ error: "No Wallet Found For this User" });
//   } else {
//     return res.json({ success: true, data: userwallet });
//   }
// };

// exports.UpdateUserWalletStatusByAdmin = async (req, res) => {
//   try {
//     const updatedWalletStatus = await Wallet.findByIdAndUpdate(
//       { _id: req.params.walletId },
//       {
//         $set: {
//           walletStatus: req.body.walletStatus,
//         },
//       },
//       { new: true, useFindAndModify: false }
//     );
//     if (!updatedWalletStatus) {
//       return res
//         .status(400)
//         .json({ success: false, error: "Wallet Status Not Updated" });
//     } else {
//       return res.status(200).json({
//         success: true,
//         message: `Wallet status Updated Successfully`,
//         data: updatedWalletStatus,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// // exports.updateWalletMoney = async(req,res,next) => {
// //     const { WalletTxnId, transactionName, transactionStatus , transactionType, transactionAmount} = req.body;
// //     if(transactionStatus == 'Success') {

// //         if(transactionType == 'Credit') {

// //             const updateWalletAmount = Wallet.findOneAndUpdate(
// //                 {user: req.profile._id},
// //                 {$inc: {
// //                     walletMoney: +transactionAmount
// //                 }},
// //                 {new:true, useFindAndModify:false},
// //                 (err, updatedWalletAmount) => {
// //                     if(err) {
// //                         return res.status(400).json({success:false, error:'Something Went Wrong !! Amount Not Updated'})
// //                     }
// //                     res.json({success:true, message:`Amount Added Successfully`, data:updatedWalletAmount})
// //                 }
// //             )
// //             next()

// //         } if(transactionType == 'Debit') {

// //             let walletAmount;

// //             Wallet.findOne({user:req.profile._id})
// //             .exec((err, userWallet) => {
// //                 if (err) {
// //                 return res.status(400).json({success:false, error: "cart empty" });
// //                 }
// //                 walletAmount = userWallet.walletMoney

// //                 if(walletAmount >= transactionAmount) {
// //                     const updateWalletAmount = await Wallet.findOneAndUpdate(
// //                         {user: req.profile._id},
// //                         {$inc: {
// //                             walletMoney: -transactionAmount
// //                         }},
// //                         {new:true, useFindAndModify:false},
// //                         (err, updatedWalletStatus) => {
// //                             if(err) {
// //                                 return res.status(400).json({success:false, error:'Something Went Wrong !! Amount Not Updated'})
// //                             }
// //                             res.json({success:true, message:`Amount Deducted Successfully`, data:updateWalletAmount})
// //                         }
// //                     )
// //                     next()
// //                 } else {
// //                     return res.status(402).json({success:false, error:'Insufficient Funds!! Add Money First'})
// //                 }
// //             });

// //         }

// //     } else {
// //         next()
// //     }
// // }
// exports.updateWalletMoney = async (req, res, next) => {
//   const {
//     WalletTxnId,
//     transactionName,
//     transactionStatus,
//     transactionType,
//     transactionAmount,
//   } = req.body;
//   if (transactionStatus === "Success") {
//     try {
//       if (transactionType === "Credit") {
//         const updatedWalletAmount = await Wallet.findOneAndUpdate(
//           { user: req.profile._id },
//           {
//             $inc: {
//               walletMoney: transactionAmount,
//             },
//           },
//           { new: true, useFindAndModify: false }
//         );
//         res.json({
//           success: true,
//           message: "Amount Added Successfully",
//           data: updatedWalletAmount,
//         });
//         next();
//       } else if (transactionType === "Debit") {
//         const userWallet = await Wallet.findOne({ user: req.profile._id });
//         if (!userWallet) {
//           return res
//             .status(400)
//             .json({ success: false, error: "User wallet not found" });
//         }
//         const walletAmount = userWallet.walletMoney;
//         if (walletAmount >= transactionAmount) {
//           const updatedWalletAmount = await Wallet.findOneAndUpdate(
//             { user: req.profile._id },
//             {
//               $inc: {
//                 walletMoney: -transactionAmount,
//               },
//             },
//             { new: true, useFindAndModify: false }
//           );
//           res.json({
//             success: true,
//             message: "Amount Deducted Successfully",
//             data: updatedWalletAmount,
//           });
//           next();
//         } else {
//           return res
//             .status(402)
//             .json({
//               success: false,
//               error: "Insufficient Funds!! Add Money First",
//             });
//         }
//       }
//     } catch (error) {
//       return res
//         .status(400)
//         .json({
//           success: false,
//           error: "Something Went Wrong !! Amount Not Updated",
//         });
//     }
//   } else {
//     next();
//   }
// };

// exports.UpdateTxnsInWallet = async (req, res) => {
//   const {
//     WalletTxnId,
//     transactionName,
//     transactionStatus,
//     transactionType,
//     transactionAmount,
//   } = req.body;

//   try {
//     const updateTxn = await Wallet.findOneAndUpdate(
//       {
//         user: req.profile._id,
//         "transactions.WalletTxnId": { $ne: req.body.WalletTxnId },
//       }, // Query parameter
//       {
//         $push: {
//           transactions: {
//             WalletTxnId: WalletTxnId,
//             transactionName: transactionName,
//             transactionStatus: transactionStatus,
//             transactionType: transactionType,
//             transactionAmount: transactionAmount,
//           },
//         },
//       },
//       { new: true, useFindAndModify: false },
//       (err, updatedWalletStatus) => {
//         if (err) {
//           return res
//             .status(400)
//             .json({ success: false, error: "Wallet Status Not Updated" });
//         }
//         res.json({
//           success: true,
//           message: `Wallet status Updated Successfully`,
//           data: updatedWalletStatus,
//         });
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };
