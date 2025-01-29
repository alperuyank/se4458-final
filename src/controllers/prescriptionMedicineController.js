const prescriptionMedicineModel = require('../models/prescriptionMedicineModel');

const addMedicine = async (req, res) => {
  const { prescriptionId, medicine_name, quantity } = req.body;

  if (!prescriptionId || !medicine_name || !quantity) {
    return res.status(400).json({ message: 'Prescription ID, Medicine ID, and Quantity are required' });
  }

  try {
    const newMedicine = await prescriptionMedicineModel.addMedicineToPrescription(prescriptionId, medicine_name, quantity);
    res.status(201).json({
      message: 'Medicine added to prescription',
      medicine: newMedicine,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding medicine to prescription' });
  }
};

const removeMedicine = async (req, res) => {
  const { prescriptionId, medicine_name } = req.body;

  if (!prescriptionId || !medicine_name) {
    return res.status(400).json({ message: 'Prescription ID and Medicine ID are required' });
  }

  try {
    const removedMedicine = await prescriptionMedicineModel.removeMedicineFromPrescription(prescriptionId, medicine_name);
    res.status(200).json({
      message: 'Medicine removed from prescription',
      medicine: removedMedicine,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing medicine from prescription' });
  }
};

module.exports = { addMedicine, removeMedicine };
