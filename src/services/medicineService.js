const puppeteer = require('puppeteer');
const axios = require('axios');
const ExcelJS = require('exceljs');
const Medicine = require('../models/medicineModel'); // MongoDB modeliniz

const MEDICINE_LIST_URL = "https://www.titck.gov.tr/dinamikmodul/43"; // Sayfanın URL'si

const getExcelFile = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false, // 'true' yaparak tarayıcıyı başlatıyoruz
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 }); // Sayfa boyutunu belirliyoruz

    // Sayfayı yükleyip, tamamen yüklenmesini bekliyoruz
    await page.goto(MEDICINE_LIST_URL, { waitUntil: 'networkidle2' }); // Sayfanın tamamen yüklenmesini bekliyoruz

    // Sayfanın belirli bir elementinin yüklenmesini bekliyoruz
    const elementExists = await page.$('#myTable > tbody > tr:nth-child(1) > td:nth-child(3) > div > a');
    if (!elementExists) {
      throw new Error('Excel dosyasının bağlantısı bulunamadı. Sayfa öğesi mevcut değil.');
    }

    // 'a' etiketindeki href değerini alıyoruz
    const href = await page.$eval('#myTable > tbody > tr:nth-child(1) > td:nth-child(3) > div > a', link => link.href);

    if (!href) {
      throw new Error("Excel dosyasının bağlantısı bulunamadı.");
    }

    console.log("Excel dosyasının indirileceği bağlantı: ", href);

    // Excel dosyasını axios ile alıyoruz
    const response = await axios({
      url: href,
      method: 'GET',
      responseType: 'arraybuffer', // Dosyayı buffer olarak alıyoruz
    });

    // Excel dosyasını buffer olarak alıp, doğrudan işleme
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(response.data); // Buffer verisini yükle

    const worksheet = workbook.worksheets[0]; // İlk sayfayı al
    const medicines = []; // İlaçları depolayacağımız dizi

    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex > 3) { // İlk üç satırı geç (başlık satırları)
        const name = row.getCell(1).value?.toString().trim(); // İsim verisini al
        const price = Math.random() * 10; // Rastgele fiyat oluştur
        if (name) {
          medicines.push({ name, price}); // İlaç bilgilerini listeye ekle
        }
      }
    });

    // Eğer ilaç verileri varsa, veritabanını güncelle
    if (medicines.length > 0) {
      console.log(`Parsed ${medicines.length} medicines. Updating database...`);

      // Eski ilaçları sil
      await Medicine.deleteMany({});
      // Yeni ilaçları ekle
      await Medicine.insertMany(medicines);

      console.log("Medicine list updated successfully.");
    } else {
      console.log("No medicines found in the file.");
    }

    // Tarayıcıyı kapatıyoruz
    await browser.close();
  } catch (error) {
    console.error("Failed to download and process Excel file:", error.message);
  }
};

module.exports = { getExcelFile };
