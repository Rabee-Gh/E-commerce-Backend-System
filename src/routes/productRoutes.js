const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middlewares/authMiddleware");
const { uploadMultiple } = require("../middlewares/uploadMiddleware");
const validate = require("../middlewares/validationMiddleware");
const {
  createProductValidation,
  updateProductValidation,
  productQueryValidation,
  productIdValidation,
} = require("../validation/productValidation");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} = require("../controllers/productController");

// Public routes
router.get("/", validate(productQueryValidation), getProducts);
router.get("/:id", validate(productIdValidation), getProduct);
router.get("/categories", getCategories);

// Admin routes
router.post(
  "/",
  protect,
  admin,
  uploadMultiple("images", 5),
  validate(createProductValidation),
  createProduct
);

router.put(
  "/:id",
  protect,
  admin,
  uploadMultiple("images", 5),
  validate(updateProductValidation),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  admin,
  validate(productIdValidation),
  deleteProduct
);

module.exports = router;
