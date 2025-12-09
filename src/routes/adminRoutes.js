const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middlewares/authMiddleware");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// All routes require admin access
router.use(protect);
router.use(admin);

router.get("/stats", async (req, res) => {
  try {
    // Get counts
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();

    // Get total sales
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    // Get recent orders
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort("-createdAt")
      .limit(5);

    // Get top products
    const topProducts = await Product.find().sort("-ratings").limit(5);

    res.json({
      success: true,
      data: {
        counts: {
          users: userCount,
          products: productCount,
          orders: orderCount,
          sales: totalSales,
        },
        recentOrders,
        topProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching stats",
    });
  }
});

module.exports = router;
