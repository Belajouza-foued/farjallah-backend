const express = require("express");

const router = express.Router();


const {
    createInvoice,
    getInvoicePDF
} = require("../controllers/invoiceController");


const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");



// Créer une facture depuis une commande

router.post(
    "/:orderId",
    protect,
    adminOnly,
    createInvoice
);



// Télécharger facture PDF

router.get(
    "/:id/pdf",
    protect,
    adminOnly,
    getInvoicePDF
);



module.exports = router;