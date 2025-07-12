const mlController = require("../controller/mlIntegration.controller");
const mlService = require("../service/mlIntegration.service");

// Mock the service module
jest.mock("../service/mlIntegration.service");

describe("ML Integration Controller Tests", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {
        age: 45,
        diseases: ["Diabetes"],
        gender: "Male",
      },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("matchTrials", () => {
    it("should successfully match trials and return results", async () => {
      // Mock the service function
      const mockResult = [
        { trialId: 1, matchScore: 0.95 },
        { trialId: 2, matchScore: 0.87 },
      ];
      mlService.runPythonScript.mockResolvedValue(mockResult);

      await mlController.matchTrials(mockReq, mockRes);

      expect(mlService.runPythonScript).toHaveBeenCalledWith({
        patient: mockReq.body,
        trials: [
          { id: 1, disease_required: "Diabetes", min_age: 18, max_age: 65 },
          {
            id: 2,
            disease_required: "Hypertension",
            min_age: 30,
            max_age: 80,
          },
        ],
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        matches: mockResult,
      });
    });

    it("should handle service errors gracefully", async () => {
      const mockError = new Error("Python script failed");
      mlService.runPythonScript.mockRejectedValue(mockError);

      await mlController.matchTrials(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Internal server error during ML matching.",
        error: "Python script failed",
      });
    });

    it("should handle missing request body", async () => {
      mockReq.body = undefined;
      const mockResult = [];
      mlService.runPythonScript.mockResolvedValue(mockResult);

      await mlController.matchTrials(mockReq, mockRes);

      expect(mlService.runPythonScript).toHaveBeenCalledWith({
        patient: undefined,
        trials: expect.any(Array),
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should handle empty trials data", async () => {
      // Mock getClinicalTrialData to return empty array
      const originalGetClinicalTrialData = mlController.getClinicalTrialData;
      mlController.getClinicalTrialData = jest.fn().mockResolvedValue([]);

      const mockResult = [];
      mlService.runPythonScript.mockResolvedValue(mockResult);

      await mlController.matchTrials(mockReq, mockRes);

      expect(mlService.runPythonScript).toHaveBeenCalledWith({
        patient: mockReq.body,
        trials: [],
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        matches: mockResult,
      });
    });
  });
});

// ===========================================
// HELPER FUNCTIONS FOR TESTING
// ===========================================
describe("Helper Functions", () => {
  describe("getClinicalTrialData", () => {
    it("should return expected trial data structure", async () => {
      // Since getClinicalTrialData is not exported, we test it indirectly
      const mockResult = [];
      mlService.runPythonScript.mockResolvedValue(mockResult);

      const mockReq = { body: { age: 30 } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await mlController.matchTrials(mockReq, mockRes);

      // Check if the service was called with the expected trials structure
      expect(mlService.runPythonScript).toHaveBeenCalledWith({
        patient: expect.any(Object),
        trials: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            disease_required: expect.any(String),
            min_age: expect.any(Number),
            max_age: expect.any(Number),
          }),
        ]),
      });
    });
  });
});
