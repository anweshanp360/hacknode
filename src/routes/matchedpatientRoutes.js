// routes/matchedPatients.routes.js
const express = require('express');
const router = express.Router();

const {
    storeMatchedPatients,
    fetchMatchedPatients
} = require('../controller/matchpatients.controller');

// POST: Store matched results
router.post('/match-trials', storeMatchedPatients);

// GET: View all matched patients
router.get('/match-trials', fetchMatchedPatients);

module.exports = router;
