const asyncHandler = require("../utils/asyncHandler");
const Review = require("../models/Review");
const Product = require("../models/Product");
const { uploadToCloudinary } = require("../utils/cloudinary");

const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // Check if user already reviewed this product
  const alreadyReviewed = await Review.findOne({
    user: req.user._id,
    product: productId,
  });

  if (alreadyReviewed) {
    return res.status(400).json({
      success: false,
      message: "You have already reviewed this product",
    });
  }

  // Upload review images
  let imageUrls = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadToCloudinary(file, "reviews");
      imageUrls.push(result.secure_url);
    }
  }

  // Create review
  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating: Number(rating),
    comment,
    images: imageUrls,
  });

  // Update product rating
  const reviews = await Review.find({ product: productId });
  const numReviews = reviews.length;
  const avgRating =
    reviews.reduce((sum, item) => sum + item.rating, 0) / numReviews;

  await Product.findByIdAndUpdate(productId, {
    ratings: avgRating,
    numReviews,
  });

  res.status(201).json({
    success: true,
    message: "Review added successfully",
    data: review,
  });
});

const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.id })
    .populate("user", "name avatar")
    .sort("-createdAt");

  res.json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: "Review not found",
    });
  }

  // Check if user owns the review
  if (review.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to update this review",
    });
  }

  const { rating, comment } = req.body;

  review.rating = rating || review.rating;
  review.comment = comment || review.comment;

  await review.save();

  // Update product rating
  const reviews = await Review.find({ product: review.product });
  const numReviews = reviews.length;
  const avgRating =
    reviews.reduce((sum, item) => sum + item.rating, 0) / numReviews;

  await Product.findByIdAndUpdate(review.product, {
    ratings: avgRating,
    numReviews,
  });

  res.json({
    success: true,
    message: "Review updated successfully",
    data: review,
  });
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: "Review not found",
    });
  }

  // Check if user owns the review or is admin
  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to delete this review",
    });
  }

  await review.deleteOne();

  // Update product rating
  const reviews = await Review.find({ product: review.product });
  const numReviews = reviews.length;
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, item) => sum + item.rating, 0) / numReviews
      : 0;

  await Product.findByIdAndUpdate(review.product, {
    ratings: avgRating,
    numReviews,
  });

  res.json({
    success: true,
    message: "Review deleted successfully",
  });
});

module.exports = {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
};
