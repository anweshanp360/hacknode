const express = require('express');
const router = express.Router();
const { runMatch } = require('../controller/matchController');

router.post('/run-match', runMatch); // POST http://localhost:3000/api/run-match

module.exports = router;
