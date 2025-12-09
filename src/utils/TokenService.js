require("dotenv").config();
const jwt = require("jsonwebtoken");

class TokenService {
  generateAccessToken(payload) {
    return jwt.sign(
      {
        ...payload,
        type: "access",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRE || "15m",
      }
    );
  }

  generateRefreshToken(payload) {
    return jwt.sign(
      {
        ...payload,
        type: "refresh",
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
      }
    );
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Access Token Expired");
      }

      if (error.name === "JsonWebTokenError") {
        throw new Error("Invalid Access Token");
      }

      throw new Error("Token Verification Failed");
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Refresh Token Expired");
      }

      if (error.name === "JsonWebTokenError") {
        throw new Error("Invalid Refresh Token");
      }

      throw new Error("Token Verification Failed");
    }
  }
}

module.exports = new TokenService();
