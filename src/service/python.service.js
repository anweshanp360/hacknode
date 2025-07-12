
const { spawn } = require('child_process'); 
const express = require('express');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json()); // To parse JSON bodies from incoming requests

// Function to run the Python script (as defined in the previous response)
function runPythonScript(data) {
    return new Promise((resolve, reject) => {
        const pythonScriptPath = './ml_logic/match_trials.py'; // Path to your Python script
        const pythonProcess = spawn('python', [pythonScriptPath, JSON.stringify(data)]);

        let result = '';
        let errorOutput = '';

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                try {
                    resolve(JSON.parse(result));
                } catch (parseError) {
                    reject(new Error(`Failed to parse Python output: ${parseError.message}, Output: ${result}`));
                }
            } else {
                reject(new Error(`Python script exited with code ${code}. Error: ${errorOutput}`));
            }
        });

        pythonProcess.on('error', (err) => {
            reject(new Error(`Failed to start Python subprocess: ${err.message}`));
        });
    });
}

// Assume you have a function to get trial data from your DB/storage
async function getClinicalTrialData() {
    // This would be your database query or data fetching logic
    // Example placeholder:
    return [
        { id: 1, disease_required: 'Diabetes', min_age: 18, max_age: 65 },
        { id: 2, disease_required: 'Hypertension', min_age: 30, max_age: 80 }
    ];
}

// Your API endpoint where the ML logic is triggered
app.post('/api/match-trials', async (req, res) => {
    const patientData = req.body; // Data sent from React Native

    try {
        // 1. Get all trial data (or filtered relevant trials)
        const allTrials = await getClinicalTrialData();

        // 2. Prepare the data payload for the Python script
        const dataForPython = {
            patient: patientData,
            trials: allTrials
        };

        // 3. ✨ HERE IT IS! Call your runPythonScript function ✨
        const mlResult = await runPythonScript(dataForPython);

        // 4. Send the ML result back to the React Native frontend
        res.json({ success: true, matches: mlResult });

    } catch (error) {
        console.error('Error in /api/match-trials:', error);
        res.status(500).json({ success: false, message: 'Internal server error during trial matching.', error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Node.js server running on port ${PORT}`);
});