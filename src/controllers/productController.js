const asyncHandler = require("../utils/asyncHandler");
const Product = require("../models/Product");
const APIFeatures = require("../utils/apiFeatures");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");

const getProducts = asyncHandler(async (req, res) => {
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;
  const total = await Product.countDocuments(features.query._conditions);

  res.json({
    success: true,
    count: products.length,
    total,
    data: products,
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.json({
    success: true,
    data: product,
  });
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock, features, brand } =
    req.body;

  // Upload images to Cloudinary
  let imageUrls = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadToCloudinary(file, "products");
      imageUrls.push(result.secure_url);
    }
  }

  const product = await Product.create({
    name,
    description,
    price,
    category,
    images: imageUrls,
    stock,
    features: features ? features.split(",") : [],
    brand,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  const { name, description, price, category, stock, features, brand } =
    req.body;

  // Upload new images if provided
  let imageUrls = product.images;
  if (req.files && req.files.length > 0) {
    // Upload new images
    for (const file of req.files) {
      const result = await uploadToCloudinary(file, "products");
      imageUrls.push(result.secure_url);
    }
  }

  product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      price,
      category,
      images: imageUrls,
      stock,
      features: features ? features.split(",") : product.features,
      brand,
    },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // Delete images from Cloudinary
  for (const imageUrl of product.images) {
    const publicId = imageUrl.split("/").pop().split(".")[0];
    await deleteFromCloudinary(`products/${publicId}`);
  }

  await product.deleteOne();

  res.json({
    success: true,
    message: "Product deleted successfully",
  });
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct("category");

  res.json({
    success: true,
    count: categories.length,
    data: categories,
  });
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
};
