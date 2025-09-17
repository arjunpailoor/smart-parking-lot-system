const express = require("express");
const parkingRoutes = require("./routes/parking");
const { seedSlots } = require("./models/ParkingSlot");

const app = express();
app.use(express.json());

// Seed parking slots, change no. of slots in models/ParkingSlot.js
seedSlots();

// Routes
app.use("/parking", parkingRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
