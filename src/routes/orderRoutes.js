const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validationMiddleware");
const {
  createOrderValidation,
  updateOrderStatusValidation,
  orderIdValidation,
  orderQueryValidation,
} = require("../validation/orderValidation");
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/orderController");

// Protected routes
router.use(protect);

router.post("/", validate(createOrderValidation), createOrder);
router.get("/", validate(orderQueryValidation), getOrders);
router.get("/:id", validate(orderIdValidation), getOrder);

// Admin routes
router.put(
  "/:id/status",
  admin,
  validate(updateOrderStatusValidation),
  updateOrderStatus
);
router.get("/admin/all", admin, validate(orderQueryValidation), getAllOrders);

module.exports = router;
