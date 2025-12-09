const mongoose = require("mongoose");
const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["email-verification", "password-reset"],
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 3600000), // 1 hour
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // Auto delete after 1 hour
  },
});

module.exports = mongoose.model("Token", tokenSchema);
