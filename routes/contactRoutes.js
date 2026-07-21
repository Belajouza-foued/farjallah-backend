const express = require("express");
const router = express.Router();

const {
  createContact,
  getContacts,
} = require("../controllers/contactController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public
router.post("/", createContact);

// Admin
router.get("/", protect, adminOnly, getContacts);

module.exports = router;