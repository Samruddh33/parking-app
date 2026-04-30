const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  numberPlate: { type: String, unique: true },
  slotNumber: Number,
  entryTime: Date,
  exitTime: Date,
  fee: Number
});

module.exports = mongoose.model("Vehicle", vehicleSchema);