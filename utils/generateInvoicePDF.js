const PDFDocument = require("pdfkit");


const generateInvoicePDF = (invoice, res) => {

    const doc = new PDFDocument({
        margin: 50
    });


    // Nom du fichier PDF
    const fileName = `${invoice.invoiceNumber}.pdf`;


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
    .fontSize(14)
    .text(
        `FACTURE N° : ${invoice.invoiceNumber}`
    );


    doc.text(
        `Date : ${new Date(invoice.createdAt).toLocaleDateString("fr-FR")}`
    );


    doc.moveDown();



    // ======================
    // CLIENT
    // ======================

    doc
    .fontSize(14)
    .text("Client");


    doc.fontSize(12);

if(invoice.customer){

    doc.text(
        `${invoice.customer.firstName} ${invoice.customer.lastName}`
    );


    doc.text(
        `Email : ${invoice.customer.email}`
    );


    doc.text(
        `Téléphone : ${invoice.customer.phone}`
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



    invoice.products.forEach((item)=>{


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
        `TOTAL : ${invoice.total} DT`,
        {
            align:"right"
        }
    );


    doc.moveDown();



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



module.exports = generateInvoicePDF;