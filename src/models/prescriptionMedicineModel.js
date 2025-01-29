const db = require('../config/database');

// Reçeteye ilaç ekle
const addMedicineToPrescription = async (prescriptionId, medicine_name, quantity) => {
  const query = `
    INSERT INTO "Prescription_Medicine" (prescriptionid, medicine_name, Quantity)
    VALUES ($1, $2, $3) RETURNING *;
  `;
  const values = [prescriptionId, medicine_name, quantity];
  const { rows } = await db.query(query, values);
  return rows[0];
};

// Reçeteden ilaç sil
const removeMedicineFromPrescription = async (prescriptionId, medicine_name) => {
  const query = `
    DELETE FROM "Prescription_Medicine"
    WHERE prescriptionid = $1 AND medicine_name = $2 RETURNING *;
  `;
  const values = [prescriptionId, medicine_name];
  const { rows } = await db.query(query, values);
  return rows[0];
};

module.exports = { addMedicineToPrescription, removeMedicineFromPrescription };
