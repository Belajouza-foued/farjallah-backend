const Vehicle = require("../models/Vehicle");

// ======================
// CREATE VEHICLE
// ======================

const createVehicle = async (req, res) => {

    try {

        const { brand, model, year, engine, fuel } = req.body;

        const exist = await Vehicle.findOne({
            brand,
            model,
            year,
            engine,
            fuel
        });

        if (exist) {
            return res.status(400).json({
                success: false,
                message: "Ce véhicule existe déjà"
            });
        }

        const vehicle = await Vehicle.create({
            brand,
            model,
            year,
            engine,
            fuel
        });

        res.status(201).json({
            success: true,
            message: "Véhicule ajouté",
            vehicle
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ======================
// GET VEHICLES
// ======================

const getVehicles = async (req, res) => {

    try {

        const vehicles = await Vehicle.find().sort({
            brand: 1,
            model: 1,
            year: -1
        });

        res.json({
            success: true,
            vehicles
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ======================
// GET VEHICLE BY ID
// ======================

const getVehicle = async (req, res) => {

    try {

        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Véhicule introuvable"
            });
        }

        res.json({
            success: true,
            vehicle
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ======================
// UPDATE VEHICLE
// ======================

const updateVehicle = async (req, res) => {

    try {

        const vehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            }
        );

        res.json({
            success: true,
            message: "Véhicule modifié",
            vehicle
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ======================
// DELETE VEHICLE
// ======================

const deleteVehicle = async (req, res) => {

    try {

        await Vehicle.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Véhicule supprimé"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    createVehicle,
    getVehicles,
    getVehicle,
    updateVehicle,
    deleteVehicle
};