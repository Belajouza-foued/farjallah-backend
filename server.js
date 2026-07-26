const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const adminRoutes = require("./routes/adminRoutes");
const connectDB = require("./config/db");
const { protect } = require("./middleware/authMiddleware");

// Load env FIRST
dotenv.config();

// Connect DB
connectDB();

const app = express();

// =======================
// MIDDLEWARES
// =======================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// ROUTES
// =======================
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const contactRoutes = require("./routes/contactRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);


// =======================
// STATIC FILES
// =======================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =======================
// TEST ROUTES
// =======================
{/**app.get("/", (req, res) => {
  res.send("Payment Platform API");
}); */}

// profile test (auth)
app.get("/api/profile", protect, (req, res) => {
  res.json({
    success: true,
    message: "Profil utilisateur",
    user: req.user,
  });
});

// =======================
// SERVER
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});