// controllers/trialController.js
const trialService = require('../service/trial.service'); // Path to your service file

// Get all trials
const getTrials = async (req, res) => {
  try {
    const trials = await trialService.getAllTrials();
    res.json(trials);
  } catch (error) {
    console.error("Controller Error (getTrials):", error);
    res.status(500).json({ message: "Failed to fetch trials.", error: error.message });
  }
};

// Create a new trial
const createNewTrial = async (req, res) => {
  try {
    const newTrialData = req.body;
    // Basic validation (you might want a more robust validation library like Joi or Express-validator)
    if (!newTrialData || Object.keys(newTrialData).length === 0) {
      return res.status(400).json({ message: "Request body cannot be empty." });
    }

    const result = await trialService.createTrial(newTrialData);
    res.status(201).json({ message: "Trial created successfully.", details: result });
  } catch (error) {
    console.error("Controller Error (createNewTrial):", error);
    res.status(500).json({ message: "Failed to create trial.", error: error.message });
  }
};

// Update an existing trial
const updateExistingTrial = async (req, res) => {
  try {
    const trialId = parseInt(req.params.id, 10); // Ensure ID is an integer
    if (isNaN(trialId)) {
      return res.status(400).json({ message: "Invalid Trial ID provided." });
    }
    const updatedTrialData = req.body;

    if (!updatedTrialData || Object.keys(updatedTrialData).length === 0) {
      return res.status(400).json({ message: "No update data provided." });
    }

    const result = await trialService.updateTrial(trialId, updatedTrialData);

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Trial not found or no changes made." });
    }
    res.json({ message: "Trial updated successfully.", details: result });
  } catch (error) {
    console.error(`Controller Error (updateExistingTrial for ID ${req.params.id}):`, error);
    res.status(500).json({ message: "Failed to update trial.", error: error.message });
  }
};

// Delete a trial
const deleteExistingTrial = async (req, res) => {
  try {
    const trialId = parseInt(req.params.id, 10); // Ensure ID is an integer
    if (isNaN(trialId)) {
      return res.status(400).json({ message: "Invalid Trial ID provided." });
    }

    const result = await trialService.deleteTrial(trialId);

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Trial not found." });
    }
    res.json({ message: "Trial deleted successfully.", details: result });
  } catch (error) {
    console.error(`Controller Error (deleteExistingTrial for ID ${req.params.id}):`, error);
    res.status(500).json({ message: "Failed to delete trial.", error: error.message });
  }
};

module.exports = {
  getTrials,
  createNewTrial,
  updateExistingTrial,
  deleteExistingTrial
};