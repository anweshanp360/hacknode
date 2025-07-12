// controllers/mlIntegration.controller.js
const mlIntegrationService = require('../service/mlIntegration.service'); // Import the service layer

/**
 * Handles the request to trigger ML model retraining.
 * This endpoint will typically be called by an admin or a scheduled job.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
async function handleTrainModel(req, res) {
    try {
        // Call the service function to trigger model training
        const result = await mlIntegrationService.trainModel();
        // Send a success response with the data received from the Python API
        res.status(200).json({
            message: "ML model retraining process initiated successfully!",
            data: result
        });
    } catch (error) {
        // Log the error for debugging purposes
        console.error('[ML Controller] Error in handleTrainModel:', error);

        // Determine the appropriate HTTP status code and message based on the error
        if (error.response) {
            // If the error came from an Axios response (e.g., Python API returned an error)
            res.status(error.response.status).json({
                message: error.response.data.detail || "Error from Python ML API during training.",
                error: error.response.data
            });
        } else if (error.request) {
            // If the request was made but no response was received (e.g., Python API is down)
            res.status(503).json({ // 503 Service Unavailable
                message: "Failed to connect to the Python ML API. It might be unavailable.",
                error: error.message
            });
        } else {
            // Any other unexpected error
            res.status(500).json({
                message: "An unexpected error occurred while trying to train the ML model.",
                error: error.message
            });
        }
    }
}

/**
 * Handles the request to get clinical trial recommendations for a specific patient.
 * This endpoint will be called by the frontend (React Native app).
 * @param {Object} req - Express request object (expects patientId in params).
 * @param {Object} res - Express response object.
 */
async function handleGetTrialRecommendations(req, res) {
    // Parse patientId from request parameters, ensuring it's an integer
    const patientId = parseInt(req.params.patientId, 10);

    // Validate the patientId
    if (isNaN(patientId)) {
        return res.status(400).json({ message: "Invalid Patient ID provided. Must be a number." });
    }

    try {
        // Call the service function to get recommendations
        const recommendations = await mlIntegrationService.getTrialRecommendations(patientId);
        // Send the recommendations back to the client
        res.status(200).json(recommendations);
    } catch (error) {
        console.error(`[ML Controller] Error in handleGetTrialRecommendations for patient ${patientId}:`, error);

        if (error.response) {
            res.status(error.response.status).json({
                message: error.response.data.detail || `Error from Python ML API for patient ${patientId}.`,
                error: error.response.data
            });
        } else if (error.request) {
            res.status(503).json({
                message: `Failed to connect to the Python ML API for patient ${patientId} recommendations.`,
                error: error.message
            });
        } else {
            res.status(500).json({
                message: `An unexpected error occurred while fetching recommendations for patient ${patientId}.`,
                error: error.message
            });
        }
    }
}

/**
 * Handles the request to predict a single patient-trial match.
 * This might be used for specific ad-hoc predictions or testing.
 * @param {Object} req - Express request object (expects patient and trial objects in body).
 * @param {Object} res - Express response object.
 */
async function handlePredictSingleMatch(req, res) {
    const { patient, trial } = req.body; // Destructure patient and trial data from the request body

    // Basic input validation
    if (!patient || !trial) {
        return res.status(400).json({ message: "Both 'patient' and 'trial' data are required in the request body for single match prediction." });
    }

    try {
        // Call the service function to get the single match prediction
        const predictionResult = await mlIntegrationService.predictSingleMatch(patient, trial);
        // Send the prediction result back to the client
        res.status(200).json(predictionResult);
    } catch (error) {
        console.error('[ML Controller] Error in handlePredictSingleMatch:', error);

        if (error.response) {
            res.status(error.response.status).json({
                message: error.response.data.detail || "Error from Python ML API during single match prediction.",
                error: error.response.data
            });
        } else if (error.request) {
            res.status(503).json({
                message: "Failed to connect to the Python ML API for single match prediction.",
                error: error.message
            });
        } else {
            res.status(500).json({
                message: "An unexpected error occurred during single match prediction.",
                error: error.message
            });
        }
    }
}

module.exports = {
    handleTrainModel,
    handleGetTrialRecommendations,
    handlePredictSingleMatch
};