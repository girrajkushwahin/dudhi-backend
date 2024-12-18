const express = require("express");
const authenticate = require("../middlewares/authenticate");

// const {
//   issignedIn,
//   isAuthenticated,
//   isAdmin,
//   isVendor,
// } = require("../controllers/auth");

const { upload } = require("../middlewares/multer");
const {
  createProduct,
  getproductbyId,
  getproduct,
  getAllProduct,
  getAllUniqueProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");

// const { getuserbyId } = require("../controllers/user");
const { getCategoryById } = require("../controllers/category");
// const { getoccasionbyId } = require("../controllers/occasion");
const {
  getProductsByPrice,
} = require("../controllers/productFilter");
const upload2 = require("../middlewares/multer2");

const router = express.Router();

// product Routes

// router.param("userId", getuserbyId);

router.param("categoryId", getCategoryById);

// router.param("occasionId", getoccasionbyId);

//router.param("getsellershopbyid", getsellershopbyid);

router.param("productId", getproductbyId);




router.get("/product/:productId", getproduct);

router.get("/products", getAllProduct);

router.get("/product/category/:categoryId", getAllUniqueProducts);

// router.get("/product/occasion/:occasionId", getAllOccasionProducts);

//router.get("/products/sellerId/:getsellershopbyid", getAllSellerProducts);

router.put(
  "/product/update/:productId",
  authenticate,
  upload2.fields([
    {
      name: 'photos'

    },
    {
      name: 'logo',
      maxCount: 1
    },
    {
      name: 'logodimension',
      maxCount: 1
    }
  ]),
  updateProduct
);

router.post(
  "/product/upload",
  authenticate,
  upload2.fields([
    {
      name: 'photos'
    },
    {
      name: 'logo',
      maxCount: 1
    },
    {
      name: 'logodimension',
      maxCount: 1
    }
  ]),
  createProduct
);

router.delete(
  "/product/delete/:productId",
  authenticate,
  // issignedIn,
  // isAuthenticated,
  // isAdmin,
  deleteProduct
);

// FILTERS

// router.get("/product/filter/color/:colorName", getProductsByColor);

// router.get(
//   "/product/filter/composition/:composition",
//   getProductsByComposition
// );

// router.get("/product/filter/size/:size", getProductsBySize);

// router.get("/product/filter/brand/:brand", getProductsByBrand);

router.get("/product/filter/price/:minPrice/:maxPrice", getProductsByPrice);

module.exports = router;
