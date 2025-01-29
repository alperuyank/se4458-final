const prescriptionModel = require('../models/prescriptionModel');
const prescriptionMedicineModel = require('../models/prescriptionMedicineModel'); 
const Medicine = require("../models/medicineModel");
const db = require('../config/database');



const createPrescription = async (req, res) => {
  const {doctorId, status, medicineList, tcid, fullname } = req.body;
  const userId = req.user?.userID;  // Kullanıcı ID'sini JWT'den alıyoruz

  console.log('userId:', userId);  // Kullanıcı ID'sini kontrol edelim

  if (!status || !medicineList || !Array.isArray(medicineList)) {
    return res.status(400).json({ message: 'Missing required fields or invalid medicine list' });
  }

  try {
    // 1. Reçete oluşturuluyor
    const newPrescription = await prescriptionModel.createPrescription(doctorId, status, userId, tcid, fullname);
    console.log('New prescription:', newPrescription);
    // 2. Reçeteye ilaç ekleniyor
    for (let medicine of medicineList) {
      const { medicine_name, quantity } = medicine;

      // Reçeteye ilacı eklerken, doğru prescriptionId'yi kullanıyoruz
      console.log('Adding medicine:', medicine);
      await prescriptionMedicineModel.addMedicineToPrescription(newPrescription.prescriptionid, medicine_name, quantity);
    }

    res.status(201).json({
      message: 'Prescription created successfully',
      prescription: newPrescription,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating prescription' });
  }
};

const updatePrescriptionStatus = async (req, res) => {
  const { prescriptionId, status } = req.body;
  const updatedBy = req.user.userId;

  if (!prescriptionId || !status) {
    return res.status(400).json({ message: 'Prescription ID and status are required' });
  }

  try {
    const updatedPrescription = await prescriptionModel.updatePrescriptionStatus(prescriptionId, status, updatedBy);
    res.status(200).json({
      message: 'Prescription status updated successfully',
      prescription: updatedPrescription,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating prescription status' });
  }
};
// Get all incomplete prescriptions
const getIncompletePrescriptions = async (req, res) => {
  try {
    const prescriptions = await prescriptionModel.getIncompletePrescriptions();
    res.status(200).json(prescriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Prescription ID'ye göre reçete getir
const getPrescriptionById = async (req, res) => {
  const { prescriptionId } = req.params;

  if (!prescriptionId) {
    return res.status(400).json({ message: 'Prescription ID is required' });
  }

  try {
    const prescription = await prescriptionModel.getPrescriptionById(prescriptionId);


    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.status(200).json({
      message: 'Prescription found successfully',
      prescription,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving prescription' });
  }
};

const getMedicinesByPrescriptionId = async (req, res) => {
  const { prescriptionId } = req.params;

  if (!prescriptionId) {
    return res.status(400).json({ message: 'Prescription ID is required' });
  }

  try {
    const medicines = await prescriptionModel.getMedicinesByPrescriptionId(prescriptionId);

    if (medicines.length === 0) {
      return res.status(404).json({ message: 'No medicines found for this prescription ID' });
    }

    // Her bir ilacı işleyelim ve ilaç adı ve fiyatı ile güncelleyelim
    const medicinesWithDetails = await Promise.all(medicines.map(async (medicine) => {
      // İlaç adını ve fiyatını Medicine modelinden alıyoruz
      const medicineDetails = await getMedicineByName(medicine.medicine_name);

      // Medicine details ile orijinal medicine verisini birleştiriyoruz
      return {
        ...medicine,
        price: medicineDetails ? medicineDetails.price : null,
      };
    }));
    console.log('Medicines with details:', medicinesWithDetails);
    res.status(200).json(medicinesWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching medicines' });
  }
};

async function getMedicineByName(medicineName) {
  try {
    const medicine = await Medicine.findOne({ name: medicineName }).select('name price');  // Sadece 'name' ve 'price' alanlarını seçiyoruz

    if (!medicine) {
      console.log('İlaç bulunamadı.');
      return null;
    }

    return medicine;  // İlaç bulundu, price ile birlikte döndürüyoruz
  } catch (error) {
    console.error('Hata oluştu:', error);
    return null;
  }
}

const markMedicineAsGiven = async (req, res) => {
  const { prescriptionId, medicineName } = req.body;

  if (!prescriptionId || !medicineName) {
    return res.status(400).json({ message: 'Prescription ID and medicine name are required' });
  }

  try {
    // İlacın "given" olarak işaretlenmesi
    const query = `
      UPDATE "Prescription_Medicine"
      SET "isGiven" = true
      WHERE "prescriptionid" = $1 AND "medicine_name" = $2
      RETURNING *;
    `;
    const values = [prescriptionId, medicineName];
    const { rows } = await db.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Medicine not found for the given prescription ID' });
    }

    // Şimdi, reçetedeki tüm ilaçları kontrol edelim ve "complete" durumunu güncelleyelim
    const allGivenQuery = `
      SELECT COUNT(*) FROM "Prescription_Medicine"
      WHERE "prescriptionid" = $1 AND "isGiven" = false;
    `;
    const { rows: allGivenRows } = await db.query(allGivenQuery, [prescriptionId]);

    const incompleteMedicines = parseInt(allGivenRows[0].count, 10);

    if (incompleteMedicines === 0) {
      // Tüm ilaçlar verildi, reçeteyi "complete" olarak güncelle
      const updateStatusQuery = `
        UPDATE "Prescription"
        SET "status" = 'complete'
        WHERE "prescriptionid" = $1 RETURNING *;
      `;
      await db.query(updateStatusQuery, [prescriptionId]);
    }

    res.status(200).json({
      message: 'Medicine marked as given successfully',
      medicine: rows[0],  // Güncellenen ilaç verisini döndürüyoruz
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error marking medicine as given' });
  }
};




module.exports = { createPrescription, updatePrescriptionStatus, getIncompletePrescriptions, getPrescriptionById, getMedicinesByPrescriptionId,markMedicineAsGiven };

