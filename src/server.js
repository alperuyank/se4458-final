// server.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { connectRabbitMQ } = require("./config/rabbitmq");
const connectToMongoDB = require("./config/mongodb");
const { startMedicineUpdateJob } = require("./schedulers/medicineScheduler");
const { scheduleNotifications } = require("./schedulers/notificationScheduler");


// const {
//   scheduleNotifications,
// } = require("./schedulers/notificationScheduler");
// const {
//   scheduleMedicineUpdate,
// } = require("./src/schedulers/medicineScheduler");

// Initialize environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

connectToMongoDB();
startMedicineUpdateJob();
scheduleNotifications();

// connectRabbitMQ().then(() => {
//   console.log("RabbitMQ connected");
//   // Start notification scheduler
//   scheduleNotifications();
// });
// scheduleMedicineUpdate();

// Routes
const authRoutes = require('./routes/authRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const prescriptionMedicineRoutes = require('./routes/prescriptionMedicineRoutes');
const medicineRoutes = require('./routes/medicineRoutes');


app.use('/api/auth', authRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/prescription_medicine', prescriptionMedicineRoutes);
app.use('/api/medicines', medicineRoutes);




// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
