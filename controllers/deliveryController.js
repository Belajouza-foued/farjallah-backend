const DeliveryNote = require("../models/DeliveryNote");
const Order = require("../models/Order");
const User = require("../models/User");
const generateDeliveryPDF = require("../utils/generateDeliveryPDF");


// =======================
// CREATE DELIVERY NOTE
// =======================

const createDeliveryNote = async (req, res) => {

    try {

       const order = await Order.findById(req.params.orderId)
    .populate("products.product", "name price");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Commande introuvable"
            });
        }

        // Vérifier si un bon existe déjà
        const existDelivery = await DeliveryNote.findOne({
            order: order._id
        });

        if (existDelivery) {
            return res.status(400).json({
                success: false,
                message: "Un bon de livraison existe déjà pour cette commande."
            });
        }

        const user = await User.findById(order.user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Client introuvable"
            });
        }

        const deliveryNumber = "BL-" + Date.now();

        const delivery = await DeliveryNote.create({

            deliveryNumber,

            order: order._id,

            user: order.user,

            customer: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                address: user.address || ""
            },

           products: order.products.map(item=>({

    name: item.product.name,

    quantity: item.quantity,

    price: item.product.price

})),
            total: order.total,

            status: "prepared"

        });

        res.status(201).json({
            success: true,
            message: "Bon de livraison créé",
            delivery
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// =======================
// GET ALL DELIVERY NOTES
// =======================

const getAllDeliveryNotes = async (req, res) => {

    try {

        const deliveries = await DeliveryNote.find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            deliveries
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// =======================
// UPDATE STATUS
// =======================

const updateDeliveryStatus = async (req, res) => {

    try {

        const delivery = await DeliveryNote.findById(req.params.id);

        if (!delivery) {
            return res.status(404).json({
                success: false,
                message: "Bon introuvable"
            });
        }

        delivery.status = req.body.status;

        await delivery.save();

        res.json({
            success: true,
            message: "Statut mis à jour",
            delivery
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// =======================
// DOWNLOAD PDF
// =======================

const getDeliveryPDF = async (req, res) => {

    try {

        const delivery = await DeliveryNote.findById(req.params.id);

        if (!delivery) {
            return res.status(404).json({
                success: false,
                message: "Bon introuvable"
            });
        }

        generateDeliveryPDF(delivery, res);

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


module.exports = {
    createDeliveryNote,
    getAllDeliveryNotes,
    updateDeliveryStatus,
    getDeliveryPDF
};