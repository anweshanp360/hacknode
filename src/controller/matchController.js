const { runMatchingAPI } = require('../service/python.service');

exports.runMatch = async (req, res) => {
  try {
    const patientData = req.body;

    if (!patientData) {
      return res.status(400).json({ error: 'No patient data provided' });
    }

    const result = await runMatchingAPI(patientData);
    res.json(result);
  } catch (err) {
    console.error('Error running matching API:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
