const { runPythonScript } = require('../service/mlIntegration.service');

// (Replace with actual DB call if needed)
async function getClinicalTrialData() {
    return [
        { id: 1, disease_required: 'Diabetes', min_age: 18, max_age: 65 },
        { id: 2, disease_required: 'Hypertension', min_age: 30, max_age: 80 }
    ];
}

exports.matchTrials = async (req, res) => {
    const patientData = req.body;

    try {
        const allTrials = await getClinicalTrialData();

        const dataForPython = {
            patient: patientData,
            trials: allTrials
        };

        const result = await runPythonScript(dataForPython);

        res.status(200).json({
            success: true,
            matches: result
        });
    } catch (err) {
        console.error('ML match error:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error during ML matching.',
            error: err.message
        });
    }
};
