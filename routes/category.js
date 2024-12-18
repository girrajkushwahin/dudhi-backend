const express = require("express");
const router = express.Router();
// const { getuserbyId } = require("../controllers/user");
// const { issignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const {
  createCategory,
  getAllCategory,
  getCategoryById,
  getSingleCategory,
  getAllParentCategory,
  getCategoryByParent,
  deleteCategory,
  updateCategory,
} = require("../controllers/category");
const { upload } = require("../middlewares/multer");
const authenticate = require("../middlewares/authenticate");

// router.param("userId", getuserbyId);
router.param("categoryId", getCategoryById);

router.post(
  "/category/create",
  authenticate,
  upload('photos').single('Logo'),
  createCategory
);

router.put(
  "/category/update/:categoryId",
  authenticate,
  upload('photos').single('Logo'),
  updateCategory
);

router.delete(
  "/category/delete/:categoryId",
  authenticate,
  deleteCategory
);

router.get("/categories", getAllCategory);



router.get("/singleCategory/:categoryId", getSingleCategory);

router.get("/category/get-all-parent-category", getAllParentCategory);

router.get("/category/get-category-by-parent/:categoryId", getCategoryByParent); //here we are passing parent category Id

module.exports = router;
