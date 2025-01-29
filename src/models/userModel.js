const db = require('../config/database');
const bcrypt = require('bcrypt');

const createUser = async (username, password, role) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO "User" (Username, Password, Role)
    VALUES ($1, $2, $3) RETURNING *;
  `;
  const values = [username, hashedPassword, role];
  const { rows } = await db.query(query, values);
  return rows[0];
};

const createRoleRelatedData = async (userID, role) => {
  // Patient için TCID'yi random üret
  const generateTCID = () => {
    let tcid = '';
    for (let i = 0; i < 11; i++) {
      tcid += Math.floor(Math.random() * 10); // 0-9 arasında rastgele sayı ekle
    }
    return tcid;
  };

  // Doctor için specialization random seç
  const generateSpecialization = () => {
    const specializations = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Psychiatry', 'Oncology', 'Radiology'];
    const randomIndex = Math.floor(Math.random() * specializations.length); // random index
    return specializations[randomIndex]; // rastgele specialization döndür
  };

  if (role === 'Patient') {
    const tcid = generateTCID(); // TCID'yi random olarak oluştur
    const query = `INSERT INTO "Patient" (UserID, TCID) VALUES ($1, $2) RETURNING *;`;
    const values = [userID, tcid];
    await db.query(query, values);
  } else if (role === 'Doctor') {
    const specialization = generateSpecialization(); // specialization'ı random olarak oluştur
    const query = `INSERT INTO "Doctor" (UserID, Specialization) VALUES ($1, $2) RETURNING *;`;
    const values = [userID, specialization];
    await db.query(query, values);
  } else if (role === 'Pharmacy') {
    const query = `INSERT INTO "Pharmacy" (UserID) VALUES ($1) RETURNING *;`;
    const values = [userID];
    await db.query(query, values);
  }
};

const getUserByUsername = async (username) => {
  const query = 'SELECT * FROM "User" WHERE "username" = $1;';
  const values = [username];
  const { rows } = await db.query(query, values);
  return rows[0]; // Eğer kullanıcı varsa, ilk satırı döndürecektir
};

module.exports = {
  createUser,
  createRoleRelatedData,
  getUserByUsername,
};
