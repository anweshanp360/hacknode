// services/mlIntegration.service.js
const axios = require('axios');
const config = require('../db/config'); // Assuming your config.js is in the db folder

// Configuration for your Python ML API
// Now taking the URL directly from your config.js file
const PYTHON_ML_API_URL = config.PYTHON_ML_API_URL;

/**
 * Triggers the retraining of the ML model in the Python API.
 * @returns {Promise<Object>} The response data from the Python API.
 */
async function trainModel() {
    try {
        console.log(`[ML Service] Triggering ML model training at: ${PYTHON_ML_API_URL}/train-model`);
        const response = await axios.post(`${PYTHON_ML_API_URL}/train-model`);
        return response.data;
    } catch (error) {
        console.error('[ML Service] Error triggering ML model retraining:', error.message);
        // Re-throw the error to be caught by the controller
        throw error;
    }
}

/**
 * Fetches trial recommendations for a specific patient from the Python ML API.
 * The Python API is expected to handle fetching patient and trial data from Node.js itself.
 * @param {number} patientId - The ID of the patient.
 * @returns {Promise<Object>} The recommendations data from the Python API.
 */
async function getTrialRecommendations(patientId) {
    try {
        console.log(`[ML Service] Requesting recommendations for patient ${patientId} from: ${PYTHON_ML_API_URL}/recommend-trials-for-patient/${patientId}`);
        const response = await axios.post(`${PYTHON_ML_API_URL}/recommend-trials-for-patient/${patientId}`);
        return response.data;
    } catch (error) {
        console.error(`[ML Service] Error getting ML recommendations for patient ${patientId}:`, error.message);
        throw error;
    }
}

/**
 * Predicts the match probability for a single patient-trial pair.
 * @param {Object} patientData - The patient data object.
 * @param {Object} trialData - The trial data object.
 * @returns {Promise<Object>} The prediction result from the Python API.
 */
async function predictSingleMatch(patientData, trialData) {
    try {
        console.log(`[ML Service] Requesting single match prediction from: ${PYTHON_ML_API_URL}/predict-match`);
        const response = await axios.post(`${PYTHON_ML_API_URL}/predict-match`, { patient: patientData, trial: trialData });
        return response.data;
    } catch (error) {
        console.error('[ML Service] Error predicting single match:', error.message);
        throw error;
    }
}

module.exports = {
    trainModel,
    getTrialRecommendations,
    predictSingleMatch
};