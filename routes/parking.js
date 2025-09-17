const express = require("express");
const router = express.Router();
const { readData, writeData } = require("../models/ParkingSlot");
const { createPayment } = require("../payment");

const floorMap = {
  "large vehicle": 1,
  "car": 2,
  "bike": 3
};

// Helper: calculate available slots for all vehicle types
function getAvailableSlots(data) {
  return {
    "large vehicles": data.slots.filter(s => s.vehicleType === "large vehicle" && !s.isOccupied).length,
    "cars": data.slots.filter(s => s.vehicleType === "car" && !s.isOccupied).length,
    "bikes": data.slots.filter(s => s.vehicleType === "bike" && !s.isOccupied).length
  };
}

// Helper: calculate payment based on entry time
function calculatePayment(vehicle) {
  const now = new Date();
  const entryTime = new Date(vehicle.entryTime);
  const diffSeconds = Math.max(0, Math.floor((now - entryTime) / 1000));

  let amount = 0;
  if (vehicle.type === "bike") {
    amount = 15 + Math.floor(diffSeconds / 30) * 10;
  } else if (vehicle.type === "car") {
    amount = 20 + Math.floor(diffSeconds / 30) * 15;
  } else if (vehicle.type === "large vehicle") {
    amount = 30 + Math.floor(diffSeconds / 30) * 20;
  }
  return amount;
}

// Entry API
router.post("/entry", (req, res) => {
  const { vehicleNumber, vehicleType } = req.body;
  if (!vehicleNumber || !vehicleType) 
    return res.status(400).json({ message: "Vehicle number & type required" });

  const data = readData();

  // Prevent duplicate vehicle number
  if (data.vehicles.find(v => v.numberPlate === vehicleNumber)) {
    return res.status(400).json({ message: "Invalid, duplicate vehicle number" });
  }

  const floor = floorMap[vehicleType];
  if (!floor) return res.status(400).json({ message: "Invalid vehicle type" });

  const slot = data.slots.find(s => s.vehicleType === vehicleType && s.floor === floor && !s.isOccupied);
  if (!slot) return res.status(400).json({ message: `No available slots for ${vehicleType}s` });

  slot.isOccupied = true;
  slot.vehicleNumber = vehicleNumber;

  data.vehicles.push({
    numberPlate: vehicleNumber,
    type: vehicleType,
    entryTime: new Date(),
    slotNumber: slot.slotNumber,
    floor: slot.floor
  });

  writeData(data);

  res.json({
    message: "Vehicle parked successfully",
    slotNumber: slot.slotNumber,
    floor: slot.floor,
    vehicleType: slot.vehicleType,
    availableSlots: getAvailableSlots(data)
  });
});

// Exit API
router.post("/exit", (req, res) => {
  const { vehicleNumber, paymentMethod } = req.body;
  if (!vehicleNumber || !paymentMethod)
    return res.status(400).json({ message: "Vehicle number & payment method required" });

  const data = readData();
  const vehicleIndex = data.vehicles.findIndex(v => v.numberPlate === vehicleNumber);
  if (vehicleIndex === -1)
    return res.status(400).json({ message: "Vehicle not found in parking lot" });

  const vehicle = data.vehicles[vehicleIndex];
  const slot = data.slots.find(s => s.slotNumber === vehicle.slotNumber && s.floor === vehicle.floor);
  slot.isOccupied = false;
  slot.vehicleNumber = null;

  data.vehicles.splice(vehicleIndex, 1);
  writeData(data);

  try {
    const amount = calculatePayment(vehicle);
    const payment = createPayment(amount, paymentMethod.toUpperCase());
    const result = payment.process();

    res.json({
      message: "Vehicle exited successfully",
      slotNumber: slot.slotNumber,
      floor: slot.floor,
      payment: result,
      availableSlots: getAvailableSlots(data)
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Status API
router.get("/status", (req, res) => {
  const data = readData();
  res.json(data.slots);
});

module.exports = router;
