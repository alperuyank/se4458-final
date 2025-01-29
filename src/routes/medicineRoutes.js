const express = require("express");
const router = express.Router();
const MedicineController = require("../controllers/medicineController");

// İlaç arama endpoint'i
router.get("/", MedicineController.searchMedicine);

module.exports = router;
