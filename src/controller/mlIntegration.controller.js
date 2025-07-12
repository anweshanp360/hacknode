const matchTrialsService = require('../service/mlIntegration.service');

exports.matchTrials = async (req, res) => {
    const patientData = req.body;

    try {
        const result = await matchTrialsService.matchPatientToTrials(patientData);
        res.json({ success: true, matches: result });
    } catch (error) {
        console.error('Error during ML processing:', error);
        res.status(500).json({ success: false, message: 'Error processing trial match.' });
    }
};
