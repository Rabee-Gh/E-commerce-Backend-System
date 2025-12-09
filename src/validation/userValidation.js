const { body, param, query } = require("express-validator");

const updateProfileValidation = [
  body("name")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("phone")
    .optional()
    .matches(/^[0-9+\-\s()]*$/)
    .withMessage("Please provide a valid phone number"),
];

const updateAddressValidation = [
  body("street")
    .notEmpty()
    .withMessage("Street is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Street must be between 3 and 200 characters"),

  body("city")
    .notEmpty()
    .withMessage("City is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("City must be between 2 and 100 characters"),

  body("state")
    .notEmpty()
    .withMessage("State is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("State must be between 2 and 100 characters"),

  body("zipCode")
    .notEmpty()
    .withMessage("Zip code is required")
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage("Invalid zip code format"),

  body("country")
    .notEmpty()
    .withMessage("Country is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Country must be between 2 and 50 characters"),

  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("isDefault must be a boolean"),
];

const updateUserRoleValidation = [
  param("id").isMongoId().withMessage("Invalid user ID"),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["user", "admin"])
    .withMessage("Role must be either user or admin"),
];

const userQueryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),

  query("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either user or admin"),

  query("search")
    .optional()
    .isString()
    .withMessage("Search term must be a string"),

  query("sort")
    .optional()
    .isIn(["name", "-name", "email", "-email", "createdAt", "-createdAt"])
    .withMessage("Invalid sort value"),
];

const userIdValidation = [
  param("id").isMongoId().withMessage("Invalid user ID"),
];

module.exports = {
  updateProfileValidation,
  updateAddressValidation,
  updateUserRoleValidation,
  userQueryValidation,
  userIdValidation,
};
