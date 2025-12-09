const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { uploadMultiple } = require("../middlewares/uploadMiddleware");
const {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

// Public route
router.get("/products/:id/reviews", getProductReviews);

// Protected routes
router.use(protect);

router.post("/products/:id/reviews", uploadMultiple("images", 3), addReview);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

module.exports = router;
