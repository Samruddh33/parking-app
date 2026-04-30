const Slot = require("../models/Slot");
const Vehicle = require("../models/Vehicle");

// Initialize parking
exports.initParking = async (req, res) => {
  try {
    const total = Number(req.body.totalSlots) || 0;

    await Slot.deleteMany();
    const slots = [];
    for (let i = 1; i <= total; i++) {
      slots.push({ slotNumber: i });
    }

    await Slot.insertMany(slots);
    res.send("Parking initialized");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Vehicle entry
exports.parkVehicle = async (req, res) => {
  try {
    const { numberPlate } = req.body;

    if (!numberPlate) {
      return res.status(400).json({ error: "numberPlate required" });
    }

    // prevent duplicate active entry
    const existing = await Vehicle.findOne({ numberPlate, exitTime: null });
    if (existing) {
      return res.status(400).json({ error: "Vehicle already parked" });
    }

    const slot = await Slot.findOne({ isOccupied: false }).sort({ slotNumber: 1 });
    if (!slot) {
      return res.status(400).json({ error: "No slots available" });
    }

    slot.isOccupied = true;
    await slot.save();

    const vehicle = await Vehicle.create({
      numberPlate,
      slotNumber: slot.slotNumber,
      entryTime: new Date()
    });

    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Vehicle exit
exports.exitVehicle = async (req, res) => {
  try {
    const { numberPlate } = req.params;

    const vehicle = await Vehicle.findOne({ numberPlate, exitTime: null });
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    vehicle.exitTime = new Date();

    // fee = ₹10/hour
    const hours = Math.ceil(
      (vehicle.exitTime - vehicle.entryTime) / (1000 * 60 * 60)
    );
    vehicle.fee = hours * 10;

    await vehicle.save();

    const slot = await Slot.findOne({ slotNumber: vehicle.slotNumber });
    if (slot) {
      slot.isOccupied = false;
      await slot.save();
    }

    res.json({ message: "Vehicle exited", fee: vehicle.fee });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get status
exports.getStatus = async (req, res) => {
  try {
    const slots = await Slot.find().sort({ slotNumber: 1 });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};