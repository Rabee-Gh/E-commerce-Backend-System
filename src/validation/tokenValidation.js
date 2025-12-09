const { body, param } = require("express-validator");

const verifyEmailTokenValidation = [
  param("token")
    .notEmpty()
    .withMessage("Token is required")
    .isLength({ min: 64, max: 64 })
    .withMessage("Invalid token format"),
];

const resetPasswordTokenValidation = [
  param("token")
    .notEmpty()
    .withMessage("Token is required")
    .isLength({ min: 64, max: 64 })
    .withMessage("Invalid token format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

const tokenParamValidation = [
  param("token")
    .notEmpty()
    .withMessage("Token is required")
    .isString()
    .withMessage("Token must be a string")
    .isLength({ min: 10 })
    .withMessage("Token must be at least 10 characters"),
];

module.exports = {
  verifyEmailTokenValidation,
  resetPasswordTokenValidation,
  tokenParamValidation,
};
