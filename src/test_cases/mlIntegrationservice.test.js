const { spawn } = require("child_process");

// Mock child_process
jest.mock("child_process");

describe("ML Integration Service Tests", () => {
  let mockSpawn, mockPythonProcess;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock process
    mockPythonProcess = {
      stdout: {
        on: jest.fn(),
      },
      stderr: {
        on: jest.fn(),
      },
      on: jest.fn(),
    };

    mockSpawn = require("child_process").spawn;
    mockSpawn.mockReturnValue(mockPythonProcess);

    // Reset the module to get the actual implementation
    jest.resetModules();
  });

  describe("runPythonScript", () => {
    it("should successfully run Python script and return parsed JSON", async () => {
      // Re-import to get actual implementation
      const actualService = require("../service/mlIntegration.service");

      const testData = { patient: { age: 30 }, trials: [] };
      const expectedResult = { matches: [{ id: 1, score: 0.9 }] };

      // Mock successful execution
      const promise = actualService.runPythonScript(testData);

      // Simulate stdout data
      const stdoutCallback = mockPythonProcess.stdout.on.mock.calls.find(
        (call) => call[0] === "data"
      )[1];
      stdoutCallback(Buffer.from(JSON.stringify(expectedResult)));

      // Simulate successful close
      const closeCallback = mockPythonProcess.on.mock.calls.find(
        (call) => call[0] === "close"
      )[1];
      closeCallback(0);

      const result = await promise;

      expect(mockSpawn).toHaveBeenCalledWith(
        "python",
        [expect.stringContaining("app.py"), JSON.stringify(testData)],
        { cwd: expect.any(String) }
      );
      expect(result).toEqual(expectedResult);
    });

    it("should handle Python script execution errors", async () => {
      const actualService = require("../service/mlIntegration.service");

      const testData = { patient: { age: 30 }, trials: [] };

      const promise = actualService.runPythonScript(testData);

      // Simulate stderr data
      const stderrCallback = mockPythonProcess.stderr.on.mock.calls.find(
        (call) => call[0] === "data"
      )[1];
      stderrCallback(Buffer.from("Python error occurred"));

      // Simulate error exit
      const closeCallback = mockPythonProcess.on.mock.calls.find(
        (call) => call[0] === "close"
      )[1];
      closeCallback(1);

      await expect(promise).rejects.toThrow("Python script exited with code 1");
    });

    it("should handle JSON parsing errors", async () => {
      const actualService = require("../service/mlIntegration.service");

      const testData = { patient: { age: 30 }, trials: [] };

      const promise = actualService.runPythonScript(testData);

      // Simulate invalid JSON output
      const stdoutCallback = mockPythonProcess.stdout.on.mock.calls.find(
        (call) => call[0] === "data"
      )[1];
      stdoutCallback(Buffer.from("invalid json"));

      // Simulate successful close
      const closeCallback = mockPythonProcess.on.mock.calls.find(
        (call) => call[0] === "close"
      )[1];
      closeCallback(0);

      await expect(promise).rejects.toThrow("Failed to parse Python output");
    });

    it("should handle process spawn errors", async () => {
      const actualService = require("../service/mlIntegration.service");

      const testData = { patient: { age: 30 }, trials: [] };

      const promise = actualService.runPythonScript(testData);

      // Simulate spawn error
      const errorCallback = mockPythonProcess.on.mock.calls.find(
        (call) => call[0] === "error"
      )[1];
      errorCallback(new Error("Python not found"));

      await expect(promise).rejects.toThrow(
        "Failed to start Python subprocess"
      );
    });

    it("should handle multiple stdout chunks", async () => {
      const actualService = require("../service/mlIntegration.service");

      const testData = { patient: { age: 30 }, trials: [] };
      const expectedResult = { matches: [{ id: 1, score: 0.9 }] };

      const promise = actualService.runPythonScript(testData);

      // Simulate multiple stdout chunks
      const stdoutCallback = mockPythonProcess.stdout.on.mock.calls.find(
        (call) => call[0] === "data"
      )[1];
      stdoutCallback(Buffer.from('{"matches":['));
      stdoutCallback(Buffer.from('{"id":1,"score":0.9}]}'));

      // Simulate successful close
      const closeCallback = mockPythonProcess.on.mock.calls.find(
        (call) => call[0] === "close"
      )[1];
      closeCallback(0);

      const result = await promise;
      expect(result).toEqual(expectedResult);
    });
  });
});
