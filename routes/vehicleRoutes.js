const express = require("express");

const router = express.Router();

const {
    createVehicle,
    getVehicles,
    getVehicle,
    updateVehicle,
    deleteVehicle
} = require("../controllers/vehicleController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");


// CREATE
router.post(
    "/",
    protect,
    adminOnly,
    createVehicle
);

// GET ALL
router.get(
    "/",
    getVehicles
);

// GET ONE
router.get(
    "/:id",
    getVehicle
);

// UPDATE
router.put(
    "/:id",
    protect,
    adminOnly,
    updateVehicle
);

// DELETE
router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteVehicle
);

module.exports = router;