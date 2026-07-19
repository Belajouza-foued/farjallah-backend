const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getAllUsers, deleteUser } = require("../controllers/userController");

// GET ALL USERS
router.get("/", protect, adminOnly, getAllUsers);

// DELETE USER
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;