const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }, // Random prices for each medicine
  isAvailable: { type: Boolean, default: true },
});

const Medicine = mongoose.model("Medicine", medicineSchema);

module.exports = Medicine;
