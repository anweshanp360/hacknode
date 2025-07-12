// src/routes/patient.routes.js
const express = require('express');
const router = express.Router();
const patientController = require('../controller/patient.controller'); // Adjust path to controller

// Define routes for patient management
router.get('/', patientController.getPatientsController);
router.post('/', patientController.postPatientController);
router.put('/:id', patientController.updatePatientController); // Route for updating a patient by ID
router.delete('/:id', patientController.deletePatientController); // Route for deleting a patient by ID

module.exports = router;
