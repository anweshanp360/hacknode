// routes/mlIntegration.routes.js
const express = require('express');
const router = express.Router();
const mlIntegrationController = require('../controller/mlIntegration.controller'); // Import the controller

/**
 * @swagger
 * /api/ml/train-model:
 * post:
 * summary: Triggers the retraining of the ML model.
 * description: This endpoint initiates the retraining process of the machine learning model
 * by calling the Python ML API. It's typically used by administrators
 * or automated systems after new data is available.
 * tags:
 * - ML Integration
 * responses:
 * 200:
 * description: ML model retraining process successfully initiated.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: ML model retraining process initiated successfully!
 * data:
 * type: object
 * description: Additional data returned by the Python ML API.
 * 500:
 * description: Internal server error or an error connecting to the Python ML API.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: An unexpected error occurred while trying to train the ML model.
 * error:
 * type: string
 */
router.post('/train-model', mlIntegrationController.handleTrainModel);

/**
 * @swagger
 * /api/ml/recommend-trials/{patientId}:
 * post:
 * summary: Get clinical trial recommendations for a specific patient.
 * description: This endpoint requests clinical trial recommendations for a given patient ID
 * from the Python ML API. The Python API handles fetching the necessary
 * patient and trial data from the Node.js backend.
 * tags:
 * - ML Integration
 * parameters:
 * - in: path
 * name: patientId
 * required: true
 * schema:
 * type: integer
 * description: Numeric ID of the patient to get recommendations for.
 * responses:
 * 200:
 * description: Successfully retrieved clinical trial recommendations.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * patient_id:
 * type: integer
 * example: 123
 * recommended_trials:
 * type: array
 * items:
 * type: object
 * properties:
 * trial_id:
 * type: integer
 * example: 456
 * match_probability:
 * type: number
 * format: float
 * example: 0.8765
 * is_match:
 * type: boolean
 * example: true
 * 400:
 * description: Invalid Patient ID provided.
 * 500:
 * description: Internal server error or an error connecting to the Python ML API.
 */
router.post('/recommend-trials/:patientId', mlIntegrationController.handleGetTrialRecommendations);

/**
 * @swagger
 * /api/ml/predict-single-match:
 * post:
 * summary: Predicts the match probability for a single patient-trial pair.
 * description: This endpoint allows for predicting the match probability between
 * a single patient and a single clinical trial by sending their data
 * directly to the Python ML API.
 * tags:
 * - ML Integration
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - patient
 * - trial
 * properties:
 * patient:
 * type: object
 * description: Patient data object.
 * example:
 * patient_id: 1
 * age: 55
 * gender: "Male"
 * diagnosis_code: "C50.9"
 * biomarker_status: "Positive"
 * current_treatments: "Chemotherapy"
 * location_city: "Kolkata"
 * trial:
 * type: object
 * description: Trial data object.
 * example:
 * trial_id: 101
 * min_age: 50
 * max_age: 70
 * required_gender: "Any"
 * required_diagnosis_code: "C50.9"
 * required_biomarker_status: "Positive"
 * excluded_treatment: "None"
 * location_cities: "Kolkata,Delhi"
 * max_patients: 100
 * status: "Open"
 * responses:
 * 200:
 * description: Successfully retrieved the single match prediction.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * patient_id:
 * type: integer
 * example: 1
 * trial_id:
 * type: integer
 * example: 101
 * match_probability:
 * type: number
 * format: float
 * example: 0.95
 * is_match:
 * type: boolean
 * example: true
 * 400:
 * description: Invalid request body (missing patient or trial data).
 * 500:
 * description: Internal server error or an error connecting to the Python ML API.
 */
router.post('/predict-match', mlIntegrationController.handlePredictSingleMatch);

module.exports = router;