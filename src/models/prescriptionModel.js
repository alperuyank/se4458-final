const db = require('../config/database');

// Reçete oluştur
const createPrescription = async (doctorId, status, userId, tcid, fullname) => {
  const query = `
    INSERT INTO "Prescription" (doctorid, Status, createdBy, updatedBy, tcid, fullname)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `;
  const values = [doctorId, status, userId, userId, tcid, fullname];  // Hem CreatedBy hem de UpdatedBy için aynı userId
  const { rows } = await db.query(query, values);
  return rows[0];
};

// Reçeteyi güncelle
const updatePrescriptionStatus = async (prescriptionId, status, updatedBy) => {
  const query = `
    UPDATE "Prescription"
    SET Status = $1, updatedBy = $2, updatedAt = CURRENT_TIMESTAMP
    WHERE PrescriptionID = $3 RETURNING *;
  `;
  const values = [status, updatedBy, prescriptionId];
  const { rows } = await db.query(query, values);
  return rows[0];
};

// prescriptionId'ye göre reçete getir
const getPrescriptionById = async (prescriptionId) => {
  const query = `
    SELECT * FROM "Prescription"
    WHERE PrescriptionID = $1;
  `;
  const values = [prescriptionId];
  const { rows } = await db.query(query, values);

  // Eğer reçete bulunursa döner, yoksa null döner
  return rows.length ? rows[0] : null;
};

// Prescription id'ye göre ilaçları almak için fonksiyon
const getMedicinesByPrescriptionId = async (prescriptionId) => {
  const query = `
    SELECT pm.medicine_name, pm.quantity
    FROM "Prescription_Medicine" pm
    WHERE pm.prescriptionid = $1;
  `;
  const values = [prescriptionId];
  const { rows } = await db.query(query, values);
  return rows;
};



module.exports = { createPrescription, updatePrescriptionStatus, getPrescriptionById, getMedicinesByPrescriptionId  };



