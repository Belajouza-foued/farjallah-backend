const Contact = require("../models/Contact");

// =======================
// CREATE CONTACT
// =======================
const createContact = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      subject,
      message,
    } = req.body;

    const contact = await Contact.create({
      firstName,
      lastName,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message envoyé avec succès",
      contact,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =======================
// GET ALL CONTACTS (ADMIN)
// =======================
const getContacts = async (req, res) => {
  try {

    const contacts = await Contact.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      contacts,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  createContact,
  getContacts,
};