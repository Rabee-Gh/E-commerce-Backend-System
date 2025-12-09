const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");
const Token = require("../models/Token");
const TokenService = require("../utils/TokenService");
const PasswordService = require("../utils/passwordUtils");
const CookieService = require("../utils/cookieService");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  try {
    PasswordService.validatePasswordStrength(password);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  const hashedPassword = await PasswordService.hashPassword(password);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const accessToken = TokenService.generateAccessToken({
    userId: user._id,
    role: user.role,
  });
  const refreshToken = TokenService.generateRefreshToken({
    userId: user._id,
    role: user.role,
  });

  CookieService.setAccessToken(res, accessToken);
  CookieService.setRefreshToken(res, refreshToken);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const isPasswordMatch = await PasswordService.verifyPassword(
    password,
    user.password
  );
  if (!isPasswordMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const accessToken = TokenService.generateAccessToken({
    userId: user._id,
    role: user.role,
  });
  const refreshToken = TokenService.generateRefreshToken({
    userId: user._id,
    role: user.role,
  });

  CookieService.setAccessToken(res, accessToken);
  CookieService.setRefreshToken(res, refreshToken);

  res.json({
    success: true,
    message: "Logged in successfully",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

const logout = asyncHandler(async (req, res) => {
  CookieService.clearTokens(res);

  res.json({ success: true, message: "Logged out successfully" });
});

const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = CookieService.getRefreshToken(req);

  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "No refresh token provided" });
  }

  try {
    const decoded = TokenService.verifyRefreshToken(refreshToken);

    const newAccessToken = TokenService.generateAccessToken({
      userId: decoded.userId,
      role: decoded.role,
    });
    const newRefreshToken = TokenService.generateRefreshToken({
      userId: decoded.userId,
      role: decoded.role,
    });

    CookieService.setAccessToken(res, newAccessToken);
    CookieService.setRefreshToken(res, newRefreshToken);

    res.json({ success: true, message: "Token refreshed successfully" });
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    PasswordService.validatePasswordStrength(password);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  // Find token
  const resetToken = await Token.findOne({
    token,
    type: "password-reset",
    expiresAt: { $gt: Date.now() },
  });

  if (!resetToken) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  // Find user
  const user = await User.findById(resetToken.userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const hashedPassword = await PasswordService.hashPassword(password);

  // Update password
  user.password = hashedPassword;
  await user.save();

  // Delete token
  await Token.deleteOne({ _id: resetToken._id });

  res.json({
    success: true,
    message: "Password reset successful",
  });
});

const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    PasswordService.validatePasswordStrength(newPassword);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  // Find user with password
  const user = await User.findById(req.user._id).select("+password");

  const isMatch = await PasswordService.verifyPassword(
    currentPassword,
    user.password
  );
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Current password is incorrect",
    });
  }

  const hashedPassword = await PasswordService.hashPassword(newPassword);

  // Update password
  user.password = hashedPassword;
  await user.save();

  res.json({
    success: true,
    message: "Password updated successfully",
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  await Token.create({
    userId: user._id,
    token: resetToken,
    type: "password-reset",
    expiresAt: new Date(Date.now() + 3600000),
  });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const message = `
    <h1>Password Reset Request</h1>
    <p>You requested to reset your password. Click the link below:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link will expire in 1 hour.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      html: message,
    });

    res.json({ success: true, message: "Password reset email sent" });
  } catch (error) {
    await Token.deleteOne({ token: resetToken });
    return res
      .status(500)
      .json({ success: false, message: "Email could not be sent" });
  }
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const emailToken = await Token.findOne({
    token,
    type: "email-verification",
    expiresAt: { $gt: Date.now() },
  });

  if (!emailToken) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  const user = await User.findById(emailToken.userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  user.isVerified = true;
  await user.save();
  await Token.deleteOne({ _id: emailToken._id });

  res.json({
    success: true,
    message: "Email verified successfully",
  });
});

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  updatePassword,
  verifyEmail,
};
