const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");

// créer commande
router.post("/", protect, createOrder);

// voir mes commandes
router.get("/", protect, getMyOrders);

module.exports = router;