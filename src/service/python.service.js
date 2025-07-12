const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

function findProjectRoot(startDir) {
    let currentDir = startDir;
    while (true) {
        const packageJsonPath = path.join(currentDir, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            // Check if it's the root's package.json (optional, but good practice)
            const packageJsonContent = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            if (packageJsonContent.name === 'trial-match-root') { // Or some other unique identifier
                 return currentDir;
            }
            // If not our specific root's package.json, might be a nested one (e.g., in 'Node')
            // So, keep searching upwards
        }

        const parentDir = path.dirname(currentDir);
        if (parentDir === currentDir) { // Reached file system root
            throw new Error('Could not find project root (TrialMatch) containing package.json marker.');
        }
        currentDir = parentDir;
    }
}

function runPythonScript(data) {
    return new Promise((resolve, reject) => {
        let projectRoot;
        try {
            projectRoot = findProjectRoot(__dirname);
        } catch (error) {
            return reject(error);
        }

        const pythonScriptPath = path.join(projectRoot, 'BE', 'app.py');

        console.log('Current Node.js file directory (__dirname):', __dirname);
        console.log('Discovered Project Root:', projectRoot);
        console.log('Resolved Python script path using Project Root Discovery:', pythonScriptPath);

        const pythonProcess = spawn('python', [pythonScriptPath, JSON.stringify(data)], {
            cwd: path.dirname(pythonScriptPath) // Set CWD to the BE folder
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