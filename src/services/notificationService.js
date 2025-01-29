const { getPrescriptionById, getMedicinesByPrescriptionId } = require('../models/prescriptionModel');
const sendEmail = require('../services/emailService'); // Email gönderme servisi
const db = require('../config/database');

const DEFAULT_EMAIL = "alperuyanik4342@gmail.com"; // Buraya gönderilecek default e-posta adresini yazalım

const processIncompletePrescriptions = async () => {
  try {
    // Bugünün tarihindeki eksik reçeteleri al (sadece status 'Incomplete' olanları)
    const query = `SELECT * FROM "Prescription" WHERE Status = 'Incomplete' AND createdAt >= CURRENT_DATE`;
    const { rows: prescriptions } = await db.query(query);
    console.log("Bugün için eksik reçeteler:", prescriptions);

    // E-posta içeriğini oluşturmak için boş bir değişken başlatalım
    let reportContent = '';  

    // Eksik reçeteler üzerinde döngü başlatıyoruz
    for (const prescription of prescriptions) {
      // Reçeteye ait ilaçları alıyoruz
      const medicines = await getMedicinesByPrescriptionId(prescription.prescriptionid);

      // Eksik ilaçları tespit etme kısmı burada artık gereksiz, çünkü sadece 'Incomplete' status'u kontrol ediyoruz
      reportContent += `\nPrescription ID: ${prescription.prescriptionid}\nEksik İlaçlar:\n`;

      // Her ilaç için adlarını rapora ekliyoruz
      medicines.forEach(med => {
        reportContent += `- ${med.medicine_name}\n`; // İlaç adını rapora ekliyoruz
      });
    }

    // Eğer eksik reçeteler varsa, e-posta göndereceğiz
    if (reportContent) {
      const emailSubject = "Eksik İlaçlar - Bugün İçin Reçeteler";
      const emailBody = `
        Merhaba,\n\n
        Bugün için eksik ilaçları içeren reçetelerle ilgili raporunuz aşağıdadır:\n
        ${reportContent}
        
        Lütfen eksik ilaçları temin edip hastalarınıza teslim ediniz.\n\n
        İyi çalışmalar,\n
        Sağlık Sistemi
      `;

      // E-posta gönderme işlemi
      await sendEmail(DEFAULT_EMAIL, emailSubject, emailBody);
      console.log("Eksik ilaç raporu e-posta olarak gönderildi.");
    } else {
      console.log("Bugün eksik ilaç bulunmamaktadır.");
    }
  } catch (error) {
    console.error('Error processing incomplete prescriptions:', error);
  }
};

module.exports = { processIncompletePrescriptions };
