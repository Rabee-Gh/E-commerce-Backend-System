const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validationMiddleware");
const {
  addToCartValidation,
  updateCartItemValidation,
  cartItemIdValidation,
} = require("../validation/cartValidation");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

// All routes require authentication
router.use(protect);

router.get("/", getCart);
router.post("/", validate(addToCartValidation), addToCart);
router.put("/:itemId", validate(updateCartItemValidation), updateCartItem);
router.delete("/:itemId", validate(cartItemIdValidation), removeCartItem);
router.delete("/", clearCart);

module.exports = router;
