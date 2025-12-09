const { body, param } = require("express-validator");

const addToCartValidation = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1")
    .isInt({ max: 99 })
    .withMessage("Quantity cannot exceed 99"),
];

const updateCartItemValidation = [
  param("itemId")
    .notEmpty()
    .withMessage("Item ID is required")
    .isMongoId()
    .withMessage("Invalid cart item ID"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1")
    .isInt({ max: 99 })
    .withMessage("Quantity cannot exceed 99"),
];

const cartItemIdValidation = [
  param("itemId")
    .notEmpty()
    .withMessage("Item ID is required")
    .isMongoId()
    .withMessage("Invalid cart item ID"),
];

module.exports = {
  addToCartValidation,
  updateCartItemValidation,
  cartItemIdValidation,
};
