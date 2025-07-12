// src/controllers/patient.controller.js
const patientService = require('../service/patient.service'); // Adjust path to service

/**
 * Controller to handle GET /patients requests.
 * Retrieves patients based on query parameters.
 */
const getPatientsController = async (req, res) => {
  try {
    const filters = req.query; // Filters come from query parameters
    const patients = await patientService.getAllPatients(filters);
    res.status(200).json(patients);
  } catch (error) {
    console.error('Error in getPatientsController:', error);
    res.status(500).json({ message: 'Error retrieving patients', error: error.message });
  }
};

/**
 * Controller to handle POST /patients requests.
 * Creates a new patient record.
 */
const postPatientController = async (req, res) => {
  try {
    const patientData = req.body; // Patient data comes from request body

    // Basic validation (add more comprehensive validation as needed)
    if (!patientData.patient_name || !patientData.age || !patientData.gender || !patientData.symptom_duration) {
      return res.status(400).json({ message: 'Missing required patient fields.' });
    }

    const result = await patientService.postPatient(patientData);
    res.status(201).json(result); // 201 Created
  } catch (error) {
    console.error('Error in postPatientController:', error);
    res.status(500).json({ message: 'Error creating patient', error: error.message });
  }
};

/**
 * Controller to handle PUT /patients/:id requests.
 * Updates an existing patient record.
 */
const updatePatientController = async (req, res) => {
  try {
    const patientId = parseInt(req.params.id); // Get patient ID from URL parameters
    const patientData = req.body; // Get updated patient data from request body

    if (isNaN(patientId)) {
      return res.status(400).json({ message: 'Invalid Patient ID provided.' });
    }
    if (Object.keys(patientData).length === 0) {
      return res.status(400).json({ message: 'No update data provided.' });
    }

    const result = await patientService.updatePatient(patientId, patientData);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result); // 404 Not Found if patient doesn't exist
    }
  } catch (error) {
    console.error('Error in updatePatientController:', error);
    res.status(500).json({ message: 'Error updating patient', error: error.message });
  }
};

/**
 * Controller to handle DELETE /patients/:id requests.
 * Deletes a patient record.
 */
const deletePatientController = async (req, res) => {
  try {
    const patientId = parseInt(req.params.id); // Get patient ID from URL parameters

    if (isNaN(patientId)) {
      return res.status(400).json({ message: 'Invalid Patient ID provided.' });
    }

    const result = await patientService.deletePatient(patientId);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result); // 404 Not Found if patient doesn't exist
    }
  } catch (error) {
    console.error('Error in deletePatientController:', error);
    res.status(500).json({ message: 'Error deleting patient', error: error.message });
  }
};

module.exports = {
  getPatientsController,
  postPatientController,
  updatePatientController,
  deletePatientController
};
