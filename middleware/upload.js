const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const path = require("path");

// =======================
// CLOUDINARY STORAGE
// =======================

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "farjallah-auto/products",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
  },
});

// =======================
// FILTRE IMAGES
// =======================

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (
    ext === ".png" ||
    ext === ".jpg" ||
    ext === ".jpeg" ||
    ext === ".webp" ||
    ext === ".avif"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

// =======================
// MULTER
// =======================

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;