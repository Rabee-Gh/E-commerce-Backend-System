// استخدمت طريقة غير المأخوذة بالجلسات
const multer = require("multer");
const path = require("path");

// Configure storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter,
});

// Middleware for single image
const uploadSingle = (fieldName) => upload.single(fieldName);

// Middleware for multiple images
const uploadMultiple = (fieldName, maxCount) =>
  upload.array(fieldName, maxCount);

module.exports = { uploadSingle, uploadMultiple };
