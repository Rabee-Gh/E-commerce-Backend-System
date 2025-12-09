const { body, param, query } = require("express-validator");

const createOrderValidation = [
  body("shippingAddress.street")
    .notEmpty()
    .withMessage("Street is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Street must be between 3 and 200 characters"),

  body("shippingAddress.city")
    .notEmpty()
    .withMessage("City is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("City must be between 2 and 100 characters"),

  body("shippingAddress.state")
    .notEmpty()
    .withMessage("State is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("State must be between 2 and 100 characters"),

  body("shippingAddress.zipCode")
    .notEmpty()
    .withMessage("Zip code is required")
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage("Invalid zip code format"),

  body("shippingAddress.country")
    .notEmpty()
    .withMessage("Country is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Country must be between 2 and 50 characters"),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["cash", "card", "paypal"])
    .withMessage("Payment method must be cash, card, or paypal"),
];

const updateOrderStatusValidation = [
  param("id").isMongoId().withMessage("Invalid order ID"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "processing", "shipped", "delivered", "cancelled"])
    .withMessage("Invalid order status"),
];

const orderQueryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),

  query("status")
    .optional()
    .isIn(["pending", "processing", "shipped", "delivered", "cancelled"])
    .withMessage("Invalid order status"),

  query("sort")
    .optional()
    .isIn(["createdAt", "-createdAt", "totalPrice", "-totalPrice"])
    .withMessage("Invalid sort value"),

  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date"),

  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date"),
];

const orderIdValidation = [
  param("id").isMongoId().withMessage("Invalid order ID"),
];

module.exports = {
  createOrderValidation,
  updateOrderStatusValidation,
  orderQueryValidation,
  orderIdValidation,
};
