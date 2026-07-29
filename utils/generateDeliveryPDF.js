const PDFDocument = require("pdfkit");

const generateDeliveryPDF = (delivery, res) => {

    const doc = new PDFDocument({
        margin: 50
    });

    // Nom du fichier PDF
    const fileName = `${delivery.deliveryNumber}.pdf`;

    res.setHeader(
        "Content-Type",
        "application/pdf"
    );

    res.setHeader(
        "Content-Disposition",
        `attachment; filename=${fileName}`
    );

    // Envoyer le PDF directement au navigateur
    doc.pipe(res);

    // ======================
    // HEADER
    // ======================

    doc
    .fontSize(20)
    .text("FARJALLAH AUTO", {
        align:"center"
    });

    doc
    .fontSize(12)
    .text("Pièces Auto & Huiles", {
        align:"center"
    });

    doc.moveDown();

    doc
    .fontSize(16)
    .text(
        `BON DE LIVRAISON N° : ${delivery.deliveryNumber}`
    );

    doc.text(
        `Date : ${new Date(delivery.createdAt).toLocaleDateString("fr-FR")}`
    );

    doc.text(
        `Statut : ${delivery.status}`
    );

    doc.moveDown();

    // ======================
    // CLIENT
    // ======================

    doc
    .fontSize(14)
    .text("Client");

    doc.fontSize(12);

    if(delivery.customer){

        doc.text(
            `${delivery.customer.firstName} ${delivery.customer.lastName}`
        );

        doc.text(
            `Email : ${delivery.customer.email}`
        );

        doc.text(
            `Téléphone : ${delivery.customer.phone}`
        );

        doc.text(
            `Adresse : ${delivery.customer.address || "Non renseignée"}`
        );

    }else{

        doc.text(
            "Client : Informations non disponibles"
        );

    }

    doc.moveDown();

    // ======================
    // PRODUITS
    // ======================

    doc
    .fontSize(14)
    .text("Produits");

    doc.moveDown();

    delivery.products.forEach((item)=>{

        doc
        .fontSize(12)
        .text(
            `${item.name} - Quantité: ${item.quantity} - Prix: ${item.price} DT`
        );

    });

    doc.moveDown();

    // ======================
    // TOTAL
    // ======================

    doc
    .fontSize(16)
    .text(
        `TOTAL : ${delivery.total} DT`,
        {
            align:"right"
        }
    );

    doc.moveDown(2);

    // ======================
    // SIGNATURES
    // ======================

    doc
    .fontSize(12)
    .text(
        "Signature du préparateur : __________________________"
    );

    doc.moveDown();

    doc.text(
        "Signature du client : ________________________________"
    );

    doc.moveDown(2);

    doc
    .fontSize(12)
    .text(
        "Merci pour votre confiance.",
        {
            align:"center"
        }
    );

    // Terminer le PDF
    doc.end();

};

module.exports = generateDeliveryPDF;