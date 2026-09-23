const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
// =======================
// Register
// =======================
const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
    } = req.body;

    // Vérifier si l'utilisateur existe
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Cet email existe déjà.",
      });
    }

    // Chiffrer le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role,
    });

    res.status(201).json({
      success: true,
      message: "Inscription réussie.",
      data: user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // chercher user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Utilisateur introuvable",
      });
    }

    // vérifier password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Mot de passe incorrect",
      });
    }

    // générer token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Connexion réussie",
      token,
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "Si cet email existe, un lien de réinitialisation sera envoyé.",
      });
    }

    // Générer un token sécurisé
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Sauvegarder le token et sa date d'expiration
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    // Configuration SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: `"Farjallah Auto" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Réinitialisation de votre mot de passe",
      html: `
        <h2>Réinitialisation du mot de passe</h2>

        <p>Bonjour ${user.firstName || ""},</p>

        <p>
          Vous avez demandé la réinitialisation de votre mot de passe.
        </p>

        <p>
          Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :
        </p>

        <p>
          <a
            href="${resetUrl}"
            style="
              display:inline-block;
              padding:12px 20px;
              background:#003DA5;
              color:white;
              text-decoration:none;
              border-radius:5px;
            "
          >
            Réinitialiser mon mot de passe
          </a>
        </p>

        <p>
          Ce lien expire dans 15 minutes.
        </p>

        <p>
          Si vous n'avez pas demandé cette réinitialisation,
          vous pouvez ignorer cet email.
        </p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Si cet email existe, un lien de réinitialisation sera envoyé.",
    });

  } catch (error) {
    console.error("Forgot password error:", error);

    res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi de l'email.",
    });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Veuillez saisir un nouveau mot de passe.",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Le lien est invalide ou a expiré.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    // Invalider le token après utilisation
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Mot de passe réinitialisé avec succès.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    res.status(500).json({
      success: false,
      message: "Erreur lors de la réinitialisation du mot de passe.",
    });
  }
};
module.exports = {
  register,
  login,
  forgotPassword,
   resetPassword,
};