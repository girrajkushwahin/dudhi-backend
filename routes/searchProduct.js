const express = require("express");
const { searchController } = require("../controllers/searchProduct");
const router = express.Router();

// router.param('key',getProductsByKey)

router.get("/products/search/:key", searchController);

module.exports = router;
