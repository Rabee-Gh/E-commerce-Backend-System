E-commerce Backend System
A complete e-commerce backend system built with Node.js, Express.js, and MongoDB.

Render Link :
https://e-commerce-backend-system-f9a2.onrender.com

Postman collection :
https://documenter.getpostman.com/view/45304972/2sB3dSNnzW

Features
 User authentication with JWT

 Product management (CRUD)

 Shopping cart functionality

 Order system

 Product reviews and ratings

 Admin dashboard

 Email password reset

 Image upload to Cloudinary

 Email notifications

 Comprehensive security

Prerequisites
Node.js (v14 or later)

MongoDB Atlas or local MongoDB

Cloudinary account

Email account (for sending emails)


API Endpoints
Authentication
POST /api/auth/register - Register new user

POST /api/auth/login - User login

POST /api/auth/logout - User logout

POST /api/auth/refresh - Refresh token

POST /api/auth/forgot-password - Request password reset

POST /api/auth/reset-password/:token - Reset password

Products
GET /api/products - Get all products

GET /api/products/:id - Get single product

POST /api/products - Create product (admin only)

PUT /api/products/:id - Update product (admin only)

DELETE /api/products/:id - Delete product (admin only)

Shopping Cart
GET /api/cart - Get user's cart

POST /api/cart - Add item to cart

PUT /api/cart/:itemId - Update cart item quantity

DELETE /api/cart/:itemId - Remove item from cart

DELETE /api/cart - Clear entire cart

Orders
POST /api/orders - Create new order

GET /api/orders - Get user's orders

GET /api/orders/:id - Get single order

PUT /api/orders/:id/status - Update order status (admin only)

Users
GET /api/users/profile - Get user profile

PUT /api/users/profile - Update profile

PUT /api/users/address - Update shipping address

Admin
GET /api/admin/stats - Get dashboard statistics

GET /api/users/admin/all - Get all users

PUT /api/users/:id/role - Update user role




Project Structure

src/
├── models/          # MongoDB models
├── controllers/     # Business logic
├── routes/          # API routes
├── middlewares/     # Express middlewares
├── utils/           # Utility functions
├── validation/      # Validation schemas
└── app.js          # Main application file


Security Features
JWT authentication with HTTP-only cookies

Password hashing with bcrypt

Rate limiting to prevent brute force attacks

XSS protection

Helmet.js for secure HTTP headers

CORS configuration

Input validation and sanitization

Secure session management