const express = require('express');
const router = express.Router();
const { matchTrials }  = require('../controller/mlIntegration.controller');

// POST /api/match-trials
router.post('/match-trials', matchTrials);

module.exports = router;
