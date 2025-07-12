const { getAllTrials } = require('../service/trial.service'); // or wherever your trial-fetching logic is
const { runPythonScript } = require('../service/python.service'); // or wherever your Python integration is

exports.matchPatientToTrials = async (patientData) => {
    // 1. Get all trial data
    const allTrials = await getAllTrials();

    // 2. Format data for Python script
    const dataForPython = {
        patient: patientData,
        trials: allTrials,
    };

    // 3. Call Python script and return result
    const mlResult = await runPythonScript(dataForPython);
    return mlResult;
};
