const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validationMiddleware");
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  updatePasswordValidation,
} = require("../validation/authValidation");
const {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  updatePassword,
  verifyEmail,
} = require("../controllers/authController");

// Public routes
router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);
router.post("/refresh", refreshToken);
router.post(
  "/forgot-password",
  validate(forgotPasswordValidation),
  forgotPassword
);
router.post(
  "/reset-password/:token",
  validate(resetPasswordValidation),
  resetPassword
);

// Protected routes
router.post("/logout", protect, logout);
router.put(
  "/update-password",
  protect,
  validate(updatePasswordValidation),
  updatePassword
);

router.get("/verify-email/:token", verifyEmail);

module.exports = router;
