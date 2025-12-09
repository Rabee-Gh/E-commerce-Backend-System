const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validationMiddleware");
const {
  updateProfileValidation,
  updateAddressValidation,
  updateUserRoleValidation,
  userQueryValidation,
} = require("../validation/userValidation");
const {
  getProfile,
  updateProfile,
  updateAddress,
  getAllUsers,
  updateUserRole,
} = require("../controllers/userController");

// Protected routes
router.use(protect);

router.get("/profile", getProfile);
router.put("/profile", validate(updateProfileValidation), updateProfile);
router.put("/address", validate(updateAddressValidation), updateAddress);

// Admin routes
router.get("/admin/all", admin, validate(userQueryValidation), getAllUsers);
router.put(
  "/:id/role",
  admin,
  validate(updateUserRoleValidation),
  updateUserRole
);

module.exports = router;
