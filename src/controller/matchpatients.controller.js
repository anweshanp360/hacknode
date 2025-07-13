// controllers/matchedPatients.controller.js
const {
    saveMatchedPatients,
    getAllMatchedPatients
} = require('../service/matchpy');

const storeMatchedPatients = async (req, res) => {
    try {
        const matches = req.body;

        if (!Array.isArray(matches) || matches.length === 0) {
            return res.status(400).json({ error: 'Invalid match data provided.' });
        }

        const result = await saveMatchedPatients(matches);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to store matched patients.' });
    }
};

const fetchMatchedPatients = async (req, res) => {
    try {
        const matchedPatients = await getAllMatchedPatients();
        res.status(200).json(matchedPatients);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch matched patients.' });
    }
};

module.exports = {
    storeMatchedPatients,
    fetchMatchedPatients
};
