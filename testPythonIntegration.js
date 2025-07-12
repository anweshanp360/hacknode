// C:\Users\AnweshaNaskar\TrialMatch\Node\testPythonIntegration.js
const { runPythonScript } = require('./src/service/mlIntegration.service'); // Adjust path if your service file is elsewhere

async function testIntegration() {
    const testData = {
        patientId: "P123",
        diagnoses: ["Cancer"],
        age: 60,
        medications: ["DrugA", "DrugB"]
    };

    console.log("--- Starting Python Integration Test ---");
    console.log("Input data for Python:", testData);

    try {
        const result = await runPythonScript(testData);
        console.log("\n--- Python Script Output (Success) ---");
        console.log("Type of result:", typeof result);
        console.log("Parsed JSON Result:", JSON.stringify(result, null, 2));

        // Basic assertions
        if (result && result.status === "success" && result.received_input && result.received_input.patientId === testData.patientId) {
            console.log("\n*** Test PASSED: Python script executed successfully and returned expected data. ***");
        } else {
            console.error("\n!!! Test FAILED: Python script output was not as expected. !!!");
        }

    } catch (error) {
        console.error("\n--- Python Integration Test FAILED ---");
        console.error("Error:", error.message);
        console.error(error); // Log the full error object for more details
        console.error("\n!!! Test FAILED: An error occurred during Python script execution or parsing. !!!");
    } finally {
        console.log("\n--- Python Integration Test Finished ---");
    }
}

testIntegration();