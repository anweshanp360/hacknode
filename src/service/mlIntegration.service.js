const path = require('path');
const { spawn } = require('child_process');

/**
 * Runs a Python script with provided data and returns its JSON output.
 * @param {Object} data - The data to pass to the Python script as a JSON string.
 * @returns {Promise<Object>} A promise that resolves with the parsed JSON output from the Python script.
 */
function runPythonScript(data) {
    return new Promise((resolve, reject) => {
        // --- IMPORTANT DEBUGGING STEP ---
        console.log('Current Node.js file directory (__dirname):', __dirname);


        const nodeFolder = path.join(__dirname, '..', '..');
        const trialMatchRoot = path.join(nodeFolder, '..');
        const pythonScriptPath = path.join(trialMatchRoot, 'BE', 'app.py');

        // --- IMPORTANT DEBUGGING STEP ---
        console.log('Calculated Node Folder:', nodeFolder);
        console.log('Calculated TrialMatch Root:', trialMatchRoot);
        console.log('Resolved Python script path to be used:', pythonScriptPath);

        const pythonProcess = spawn('python', [pythonScriptPath, JSON.stringify(data)], {
            cwd: path.dirname(pythonScriptPath) // Set CWD to the directory containing app.py (i.e., BE folder)
        });

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
            reject(new Error(`Failed to start Python subprocess: ${err.message}. Please ensure Python is installed and accessible in your system's PATH.`));
        });
    });
}

module.exports = { runPythonScript };