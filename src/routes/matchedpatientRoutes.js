// routes/matchedPatients.routes.js
const express = require('express');
const router = express.Router();

const {
getMatchedTrials
} = require('../controller/matchpatients.controller');

// POST: Store matched results
router.get('/matched-patients',getMatchedTrials);

module.exports = router;
