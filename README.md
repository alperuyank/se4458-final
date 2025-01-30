
video: https://drive.google.com/file/d/1QeUJ3fEZ6rgOK3dB5NJbWiaQe3MOmqsE/view?usp=sharing

api gateway: https://se4458-final.onrender.com/

client: https://se4458-final-front.onrender.com/



# E-Prescription System

This project provides an API that allows doctors to create electronic prescriptions, pharmacies to manage medications, and patients to view their prescriptions.

## Installation

### Requirements
- Node.js (>=14.x)
- PostgreSQL
- MongoDB

### Environment Variables

Create a `.env` file and define the following variables:

PORT=5000 JWT_SECRET=your_secret_key DB_HOST=localhost DB_USER=your_db_user DB_PASSWORD=your_db_password DB_NAME=your_db_name MONGO_URI=your_mongodb_uri

### Running the Project

1. Install the required dependencies:

npm install

2. Start the PostgreSQL and MongoDB databases.

3. Start the server:

npm start

## API Endpoints

### Authentication
- `POST /api/auth/register` → User registration
- `POST /api/auth/login` → User login

### Medicine
- `GET /api/medicines?name=asp` → Search for medicines

### Prescription
- `POST /api/prescriptions` → Create a prescription
- `PUT /api/prescriptions/status` → Update prescription status
- `GET /api/prescriptions/incomplete` → Get incomplete prescriptions
- `GET /api/prescriptions/:prescriptionId` → Get prescription by ID
- `GET /api/prescriptions/:prescriptionId/medicines` → Get medicines for a prescription
- `PATCH /api/prescriptions/markAsGiven` → Mark a medicine as "given"

### Prescription Medicine
- `POST /api/prescriptions/medicine` → Add medicine to prescription
- `DELETE /api/prescriptions/medicine` → Remove medicine from prescription

## Database Schema

### User Table
- **UserID** (Primary Key)
- **Username**
- **Password**
- **Role** (Admin, Doctor, Pharmacy, Patient)
- **createdAt**
- **updatedAt**

### Doctor Table
- **DoctorID** (Primary Key)
- **UserID** (Foreign Key, references User table)
- **Specialization**
- **CreatedAt**
- **UpdatedAt**

### Pharmacy Table
- **PharmacyID** (Primary Key)
- **UserID** (Foreign Key, references User table)
- **CreatedAt**
- **UpdatedAt**

### Prescription Table
- **PrescriptionID** (Primary Key)
- **DoctorID** (Foreign Key, references Doctor table)
- **Status**
- **CreationDate**
- **createdBy** (Foreign Key, references User table)
- **updatedBy** (Foreign Key, references User table)
- **createdAt**
- **updatedAt**

### Prescription_Medicine Table
- **PrescriptionID** (Foreign Key, references Prescription table)
- **medicine_name**
- **Quantity**
- **isGiven**

## ER Diagram

![e r](https://github.com/user-attachments/assets/9468946f-02e3-4647-b3ee-cc58bae50721)
