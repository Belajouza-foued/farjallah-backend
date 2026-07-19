const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  removeFromCart,
  updateCart,
  clearCart,
  getCartTotal,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.delete("/remove", protect, removeFromCart);
router.put("/update", protect, updateCart);
router.delete("/clear", protect, clearCart);
router.get("/total", protect, getCartTotal);

module.exports = router;