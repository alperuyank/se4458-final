const schedule = require("node-schedule");
const { getExcelFile } = require("../services/medicineService"); // Medicine işlemlerinin olduğu dosya

// Pazar günü saat 22:00'de çalışacak job
const startMedicineUpdateJob = () => {
  schedule.scheduleJob("0 22 * * 0", async () => {
    console.log("Medicine update job started at:", new Date().toLocaleString());

    try {
      await getExcelFile();
      console.log("Medicine update job completed successfully!");
    } catch (error) {
      console.error("Error during medicine update job:", error.message);
    }
  });
};

module.exports = { startMedicineUpdateJob };