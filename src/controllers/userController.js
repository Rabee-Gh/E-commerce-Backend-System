const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");
const { comparePassword } = require("../utils/passwordUtils");

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  res.json({
    success: true,
    data: user,
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;

  const user = await User.findById(req.user._id);

  // Check if email is being changed and if it already exists
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.phone = phone || user.phone;

  await user.save();

  res.json({
    success: true,
    message: "Profile updated successfully",
    data: user,
  });
});

const updateAddress = asyncHandler(async (req, res) => {
  const { street, city, state, zipCode, country, isDefault } = req.body;

  const user = await User.findById(req.user._id);

  const newAddress = {
    street,
    city,
    state,
    zipCode,
    country,
    isDefault: isDefault || false,
  };

  if (isDefault) {
    // Remove default from other addresses
    user.addresses.forEach((address) => {
      address.isDefault = false;
    });
  }

  // Check if address exists
  const addressIndex = user.addresses.findIndex(
    (addr) =>
      addr.street === street && addr.city === city && addr.zipCode === zipCode
  );

  if (addressIndex > -1) {
    user.addresses[addressIndex] = newAddress;
  } else {
    user.addresses.push(newAddress);
  }

  await user.save();

  res.json({
    success: true,
    message: "Address updated successfully",
    data: user.addresses,
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");

  res.json({
    success: true,
    count: users.length,
    data: users,
  });
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  user.role = role;
  await user.save();

  res.json({
    success: true,
    message: "User role updated successfully",
    data: user,
  });
});

module.exports = {
  getProfile,
  updateProfile,
  updateAddress,
  getAllUsers,
  updateUserRole,
};
