const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const authenticateJWT = require('../middlewares/authMiddleware');  // JWT auth middleware

router.post('/', authenticateJWT, prescriptionController.createPrescription);

// Reçete durumunu güncelle (Pharmacy ve doktor tarafından yapılabilir)
router.put('/status', authenticateJWT, prescriptionController.updatePrescriptionStatus);

router.get('/:prescriptionId', prescriptionController.getPrescriptionById);
router.get('/:prescriptionId/medicines', prescriptionController.getMedicinesByPrescriptionId);
router.patch('/markAsGiven', prescriptionController.markMedicineAsGiven);

// Get incomplete prescriptions
router.get('/incomplete', authenticateJWT, prescriptionController.getIncompletePrescriptions);

module.exports = router;
