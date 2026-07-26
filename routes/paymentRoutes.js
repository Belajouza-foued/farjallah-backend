//
const express = require("express");
const router = express.Router();

const {
  createPayment,
  confirmPayment,
} = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");

// CREATE PAYMENT
//router.post("/", protect, createPayment);

// CONFIRM PAYMENT
//router.post("/confirm", protect, confirmPayment);

module.exports = router;