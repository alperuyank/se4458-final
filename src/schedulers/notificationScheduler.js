const cron = require("node-cron");
const { processIncompletePrescriptions } = require("../services/notificationService");

// Schedule the task to run every night at 1:00 AM
const scheduleNotifications = () => {
  cron.schedule("0 1 * * *", () => {
    console.log("Starting nightly notification task...");
    processIncompletePrescriptions();
  });
};

module.exports = { scheduleNotifications };
