const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// =======================
// CREATE PRODUCT
// =======================
router.post(
  "/",
  protect,
  upload.array("images", 5),
  createProduct
);

// =======================
// GET ALL PRODUCTS
// =======================
router.get("/", getProducts);

// =======================
// GET ONE PRODUCT
// =======================
router.get("/:id", getProductById);


// =======================
// UPDATE PRODUCT
// =======================
// UPDATE PRODUCT
// =======================
router.put(
    "/:id",
    protect,
    upload.array("images", 5),
    updateProduct
);

// =======================
// DELETE PRODUCT
// =======================
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;