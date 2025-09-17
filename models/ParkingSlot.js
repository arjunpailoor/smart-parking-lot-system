const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "../data.json");

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Seed slots if data.json is empty
function seedSlots() {
  const data = readData();

  let slotsCreated = false;

  if (!data.slots || data.slots.length === 0) {
    let slots = [];

    // Floor 1 → Large vehicles (2 slots)
    for (let slotNum = 1; slotNum <= 2; slotNum++) {
      slots.push({ slotNumber: slotNum, floor: 1, vehicleType: "large vehicle", isOccupied: false });
    }

    // Floor 2 → Cars (4 slots)
    for (let slotNum = 1; slotNum <= 4; slotNum++) {
      slots.push({ slotNumber: slotNum, floor: 2, vehicleType: "car", isOccupied: false });
    }

    // Floor 3 → Bikes (8 slots)
    for (let slotNum = 1; slotNum <= 8; slotNum++) {
      slots.push({ slotNumber: slotNum, floor: 3, vehicleType: "bike", isOccupied: false });
    }

    data.slots = slots;
    data.vehicles = data.vehicles || [];
    writeData(data);

    slotsCreated = true;
  }

  console.log(slotsCreated ? "✅ Parking slots initialized" : "✅ Parking slots already exist, skipping seeding");
}


module.exports = { readData, writeData, seedSlots };
