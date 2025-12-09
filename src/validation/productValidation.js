const { body, param, query } = require("express-validator");

const createProductValidation = [
  body("name")
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Product name must be between 3 and 200 characters"),

  body("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0.01 })
    .withMessage("Price must be greater than 0"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Category must be between 2 and 50 characters"),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be 0 or greater"),

  body("brand")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Brand cannot be more than 50 characters"),

  body("features")
    .optional()
    .isString()
    .withMessage("Features must be a string"),
];

const updateProductValidation = [
  param("id").isMongoId().withMessage("Invalid product ID"),

  body("name")
    .optional()
    .isLength({ min: 3, max: 200 })
    .withMessage("Product name must be between 3 and 200 characters"),

  body("description")
    .optional()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),

  body("price")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Price must be greater than 0"),

  body("category")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category must be between 2 and 50 characters"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be 0 or greater"),

  body("brand")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Brand cannot be more than 50 characters"),
];

const productQueryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("category")
    .optional()
    .isString()
    .withMessage("Category must be a string"),

  query("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Min price must be 0 or greater"),

  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Max price must be 0 or greater"),

  query("search")
    .optional()
    .isString()
    .withMessage("Search term must be a string"),

  query("sort")
    .optional()
    .isIn([
      "price",
      "-price",
      "name",
      "-name",
      "createdAt",
      "-createdAt",
      "ratings",
      "-ratings",
    ])
    .withMessage("Invalid sort value"),
];

const productIdValidation = [
  param("id").isMongoId().withMessage("Invalid product ID"),
];

module.exports = {
  createProductValidation,
  updateProductValidation,
  productQueryValidation,
  productIdValidation,
};
