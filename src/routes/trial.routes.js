// routes/trialRoutes.js
const express = require('express');
const router = express.Router();
const trialController = require('../controller/trial.controller'); // Path to your controller file

// GET all trials
router.get('/', trialController.getTrials);

// POST a new trial
router.post('/', trialController.createNewTrial);

// PUT (update) a trial by ID
router.put('/:id', trialController.updateExistingTrial);

// DELETE a trial by ID
router.delete('/:id', trialController.deleteExistingTrial);

module.exports = router;