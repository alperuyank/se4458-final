const Medicine = require("../models/medicineModel");

// İlaç isimlerini sorgulayan kontrolcü
const searchMedicine = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ error: "Name query parameter is required." });
    }

    const medicines = await Medicine.find({
      name: { $regex: name, $options: "i" }, // Case-insensitive arama
    });

    const medicationNames = medicines.map((medicine) => medicine.name);

    res.status(200).json({ medicationNames });
  } catch (error) {
    console.error("Error while searching medicines:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};


module.exports = { searchMedicine };
