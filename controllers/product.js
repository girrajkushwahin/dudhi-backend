// const Multer = require("multer");
// const mongoose = require("mongoose");
const Product = require("../models/Product");
//const SellerShop = require('../models/sellerShop')
const fs = require("fs");

/*******************createProduct******************/

exports.createProduct = async (req, res) => {
  /* function sendSellerId() {
  
      return new Promise((resolve) => {
  
        SellerShop.findOne({ userId:req.profile._id })
        .exec((err, shop) => {
            if (err || !shop) {
              return res.status(400).json({ error: "No Shops Found Fo//r This Seller" })
            }
            resolve(shop._id)
        });
      })
    }*/

  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    photos: req.files.photos.map(file => file.path),
    category: req.body.category,
    units: req.body.units,
    discount: req.body.discount,
    subtitle: req.body.subtitle,
    logo: req.files.logo[0].path,
    logodimension: req.files.logodimension[0].path,
    rusticfinishes: JSON.parse(req.body.rusticfinishes),
    texturefinishes: JSON.parse(req.body.texturefinishes),
    colorfinishes: JSON.parse(req.body.colorfinishes),
    pricing: JSON.parse(req.body.pricing),
    stock: req.body.stock,
    sold: req.body.sold,
    visibility: req.body.visibility
  });

  const result = await product.save();
  if (!result) {
    return res.status(500).json({ message: "Error While adding product" });
  } else {
    return res.status(200).json({ success: true, data: result });
  }
};

exports.getproductbyId = async (req, res, next, id) => {
  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ message: "Product Not Found" });
  } else {
    req.product = product;
    next();
  }
};

exports.getproduct = async (req, res) => {
  //console.log(typeof req.body.occasions);
  const getProduct = await Product.findOne({ _id: req.product._id });
  if (!getProduct) {
    return res.status(400).json({ success: false, error: "product not in db" });
  } else {
    res.json({ success: true, data: getProduct });
  }
};

// ******************* getAllProduct *************************

exports.getAllProduct = async (req, res) => {
  try {
    // let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    // let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    const products = await Product.find()
    // .populate("category") //This will give the category document, not only the category id, you can retrieve the complete details of the associated category and occasions when fetching a product,
    // .populate("occasions")
    // .limit(limit)
    // .sort([[sortBy, "asc"]]);

    //.exec();

    if (!products) {
      return res
        .status(400)
        .json({ success: false, error: "No products found in the database" });
    }

    res.json({ success: true, data: products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// ******************** getAllProductByCategory **********************

exports.getAllUniqueProducts = async (req, res) => {
  const categoryId = req.params.categoryId;
  const uniqueProducts = await Product.find({ category: categoryId }); // It performs a query on the Product collection where the category field matches the category ID from the request so that we will get all products of given or specified category
  if (!uniqueProducts) {
    return res
      .status(400)
      .json({ message: "No Prodcts found in this Category" });
  } else {
    return res.status(200).json({ data: uniqueProducts });
  }
};

// ******************** getAllOccasionProducts **********************

// exports.getAllOccasionProducts = async (req, res) => {
//   const occasionId = req.params.occasionId;

//   const product = await Product.find({
//     occasions: { $in: occasionId.toString() },
//   });
//   if (!product) {
//     return res
//       .status(400)
//       .json({ message: "Product Not Found of this occasion" });
//   } else {
//     return res.status(200).json({ data: product });
//   }
// };

/*exports.updateProduct = async (req, res) => {
  if (req.body && req.files.length > 0) {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ message: "Product Not Found" });
    } else {
      const photos = product.photos;
      if (photos) {
        await photos.map((photo) => {
          fs.unlink(photo, (err, pics) => {
            if (err) {
              res
                .status(400)
                .json({ success: false, error: "pics not available" });
            }
            return;
          });
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        { _id: productId },
        {
          $set: {
            name: req.body.name,
            description: req.body.description,
            photos: req.files.map((file) => {
              return file.path;
            }),
            category: req.body.category,
            units: JSON.parse(req.body.size).reduce(function (tot, arr) {
              return tot + arr.totalUnits;
            }, 0),
            discount: req.body.discount,
            shippingCost: req.body.shippingCost,
            buyingPrice: req.body.buyingPrice,
            // rentPrice: JSON.parse(req.body.rentPrice),
            composition: req.body.composition,
            color: req.body.color,
            size: JSON.parse(req.body.size),
            brand: req.body.brand,
            stock: JSON.parse(req.body.size).reduce(function (tot, arr) {
              return tot + arr.availableUnits;
            }, 0),
            occasions: req.body.occasions,
            // sellerId: req.body.sellerId,
            visibility: req.body.visibility,
          },
        },
        { new: true, useFindAndModify: false }
      );
      if (!updatedProduct) {
        return res.status(400).json({ message: "CREDENTIALS DO NOT MATCH" });
      } else {
        return res
          .status(200)
          .json({ success: true, message: "Product updated successfully" });
      }
    }
  } else {
    const productId = req.params.id;
    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: productId },
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          category: req.body.category,
          units: JSON.parse(req.body.size).reduce(function (tot, arr) {
            return tot + arr.totalUnits;
          }, 0),
          discount: req.body.discount,
          shippingCost: req.body.shippingCost,
          buyingPrice: req.body.buyingPrice,
          //rentPrice: JSON.parse(req.body.rentPrice),
          composition: req.body.composition,
          color: req.body.color,
          size: JSON.parse(req.body.size),
          brand: req.body.brand,
          stock: JSON.parse(req.body.size).reduce(function (tot, arr) {
            return tot + arr.availableUnits;
          }, 0),
          occasions: req.body.occasions,
          //sellerId: req.body.sellerId,
          visibility: req.body.visibility,
        },
      },
      { new: true, useFindAndModify: false }
    );
    if (!updatedProduct) {
      return res.status(400).json({ message: "CREDENTIALS DO NOT MATCH" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Product updated successfully" });
    }
  }
};*/

exports.updateProduct = async (req, res) => {
  if (req.files.photos || req.files.logo || req.files.logodimension) {
    const photos = await req.product.photos;
    if (photos) {
      await photos.map((photo) => {
        fs.unlink(photo, (err, pics) => {
          if (err) {
            res
              .status(400)
              .json({ success: false, error: "pics not available" });
          }
          return;
        });
      });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: req.product._id },
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          photos: req.files.photos.map(file => file.path),
          category: req.body.category,
          units: req.body.units,
          discount: req.body.discount,
          subtitle: req.body.subtitle,
          logo: req.files.logo[0].path,
          logodimension: req.files.logodimension[0].path,
          rusticfinishes: JSON.parse(req.body.rusticfinishes),
          texturefinishes: JSON.parse(req.body.texturefinishes),
          colorfinishes: JSON.parse(req.body.colorfinishes),
          pricing: JSON.parse(req.body.pricing),
          stock: req.body.stock,
          sold: req.body.sold,
          visibility: req.body.visibility
        },
      },
      { new: true, useFindAndModify: false }
    );

    if (!updatedProduct) {
      return res.status(400).json({ message: "CREDENTIALS DO NOT MATCH" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Product updated successfully" });
    }
  } else {
    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: req.product._id },
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          category: req.body.category,
          units: req.body.units,
          discount: req.body.discount,
          subtitle: req.body.subtitle,
          rusticfinishes: JSON.parse(req.body.rusticfinishes),
          texturefinishes: JSON.parse(req.body.texturefinishes),
          colorfinishes: JSON.parse(req.body.colorfinishes),
          pricing: JSON.parse(req.body.pricing),
          stock: req.body.stock,
          sold: req.body.sold,
          visibility: req.body.visibility
        },
      },
      { new: true, useFindAndModify: false }
    );

    if (!updatedProduct) {
      return res.status(400).json({ message: "CREDENTIALS DO NOT MATCH" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Product updated successfully" });
    }
  }
};

// ******************Delete Product****************************

exports.deleteProduct = async (req, res) => {
  // if ("") {
  //   return res.status(402).json({
  //     err: "product not in db",
  //   });
  // }
  const productId = req.params.productId;
  const product = await Product.findById(productId);

  const pictures = product.photos;
  if (pictures) {
    pictures.map(async (picture) => {
      await fs.unlink(picture, (err, delPic) => {
        if (err) {
          res.status(400).json({ success: false, error: "pic not deleted" });
        }
        return;
      });
    });
  }
  // await product.remove((err, product) => {
  //   if (err) {
  //     return res.status(402).json({
  //       success: false,
  //       error: "product not in db",
  //     });
  //   }
  //   res.json(`${product.name} is deleted`);
  // });
  const deletedProduct = await product.deleteOne(product);
  if (!deletedProduct) {
    return res.status(400).json({ message: "Product Not Deleted" });
  } else {
    return res.json(`${product.name} is deleted`);
  }
};

// ************** getAllUniqueCategory ************************

// exports.getAllUniqueCategory = (req, res) => {
//   Product.distinct("category", {}, (err, category) => {
//     if (err) {
//       return res
//         .status(400)
//         .json({ success: false, error: "category not found" });
//     }
//     res.json({ success: true, data: category });
//   });
// };
