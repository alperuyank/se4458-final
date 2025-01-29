const express = require('express');
const prescriptionMedicineController = require('../controllers/prescriptionMedicineController');
const authenticateJWT = require('../middlewares/authMiddleware');
const router = express.Router();

// Reçeteye ilaç ekle
router.post('/', authenticateJWT, prescriptionMedicineController.addMedicine);

// Reçeteden ilaç sil
router.delete('/', authenticateJWT, prescriptionMedicineController.removeMedicine);

module.exports = router;
