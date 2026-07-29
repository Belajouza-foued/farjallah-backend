const express = require("express");

const router = express.Router();

const {
    createDeliveryNote,
    getAllDeliveryNotes,
    updateDeliveryStatus,
    getDeliveryPDF
} = require("../controllers/deliveryController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");


// =======================
// CREATE DELIVERY NOTE
// =======================

router.post(
    "/:orderId",
    protect,
    adminOnly,
    createDeliveryNote
);


// =======================
// GET ALL DELIVERY NOTES
// =======================

router.get(
    "/",
    protect,
    adminOnly,
    getAllDeliveryNotes
);


// =======================
// UPDATE STATUS
// =======================

router.put(
    "/:id",
    protect,
    adminOnly,
    updateDeliveryStatus
);


// =======================
// DOWNLOAD PDF
// =======================

router.get(
    "/:id/pdf",
    protect,
    adminOnly,
    getDeliveryPDF
);


module.exports = router;