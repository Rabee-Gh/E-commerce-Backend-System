const asyncHandler = require("../utils/asyncHandler");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const sendEmail = require("../utils/sendEmail");

const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  // Get user's cart
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Cart is empty",
    });
  }

  // Check stock and prepare order items
  const orderItems = [];
  let itemsPrice = 0;

  for (const cartItem of cart.items) {
    const product = cartItem.product;

    if (product.stock < cartItem.quantity) {
      return res.status(400).json({
        success: false,
        message: `Not enough stock for ${product.name}`,
      });
    }

    orderItems.push({
      name: product.name,
      quantity: cartItem.quantity,
      image: product.images[0],
      price: product.price,
      product: product._id,
    });

    itemsPrice += cartItem.quantity * product.price;
  }

  // Calculate prices
  const taxPrice = itemsPrice * 0.15; // 15% tax
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  // Create order
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  // Update stock
  for (const cartItem of cart.items) {
    await Product.findByIdAndUpdate(cartItem.product._id, {
      $inc: { stock: -cartItem.quantity },
    });
  }

  // Clear cart
  cart.items = [];
  await cart.save();

  // Send confirmation email
  const message = `
    <h1>Order Confirmation</h1>
    <p>Thank you for your order!</p>
    <p>Order ID: ${order._id}</p>
    <p>Total Amount: $${order.totalPrice.toFixed(2)}</p>
    <p>We will notify you once your order is shipped.</p>
  `;

  try {
    await sendEmail({
      email: req.user.email,
      subject: "Order Confirmation",
      html: message,
    });
  } catch (error) {
    console.error("Email sending failed:", error);
  }

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: order,
  });
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort("-createdAt");

  res.json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  // Check if user owns the order or is admin
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to view this order",
    });
  }

  res.json({
    success: true,
    data: order,
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  order.status = status;

  if (status === "delivered") {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }

  await order.save();

  res.json({
    success: true,
    message: "Order status updated",
    data: order,
  });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort("-createdAt");

  // Calculate totals
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  res.json({
    success: true,
    totalOrders,
    totalSales,
    data: orders,
  });
});

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getAllOrders,
};
