const express = require("express");
const router = express.Router();
const controller = require("../controllers/parkingController");

// Routes
router.post("/init", controller.initParking);
router.post("/entry", controller.parkVehicle);
router.post("/exit/:numberPlate", controller.exitVehicle);
router.get("/status", controller.getStatus);

module.exports = router;