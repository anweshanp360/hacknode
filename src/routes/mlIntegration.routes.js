const express = require('express');
const router = express.Router();
const matchTrialsController = require('../controller/mlIntegration.controller');

// POST /api/match-trials
router.post('/match-trials', matchTrialsController.matchTrials);

module.exports = router;
