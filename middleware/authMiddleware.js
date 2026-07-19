const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Vérifier si le token existe dans headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // vérifier token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // récupérer user sans password
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token invalide",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Accès refusé, token manquant",
    });
  }
};
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Accès refusé (admin uniquement)",
    });
  }

  next();
};

module.exports = { protect, adminOnly };