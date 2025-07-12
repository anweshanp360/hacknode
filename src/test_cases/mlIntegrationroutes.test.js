const request = require("supertest");
const express = require("express");
const mlRoutes = require("../routes/mlIntegration.routes");
const mlService = require("../service/mlIntegration.service");

// Mock the service module
jest.mock("../service/mlIntegration.service");

describe("ML Integration Routes Tests", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api", mlRoutes);
    jest.clearAllMocks();
  });

  it("should handle POST /api/match-trials", async () => {
    const mockResult = [{ trialId: 1, matchScore: 0.95 }];
    mlService.runPythonScript.mockResolvedValue(mockResult);

    const patientData = {
      age: 45,
      diseases: ["Diabetes"],
      gender: "Male",
    };

    const response = await request(app)
      .post("/api/match-trials")
      .send(patientData)
      .expect(200);

    expect(response.body).toEqual({
      success: true,
      matches: mockResult,
    });
  });

  it("should handle invalid JSON in request body", async () => {
    const response = await request(app)
      .post("/api/match-trials")
      .send("invalid json")
      .expect(400);
  });

  it("should handle service errors in route", async () => {
    mlService.runPythonScript.mockRejectedValue(new Error("Service error"));

    const patientData = {
      age: 45,
      diseases: ["Diabetes"],
    };

    const response = await request(app)
      .post("/api/match-trials")
      .send(patientData)
      .expect(500);

    expect(response.body).toEqual({
      success: false,
      message: "Internal server error during ML matching.",
      error: "Service error",
    });
  });
});

// ===========================================
// INTEGRATION TESTS
// ===========================================
describe("Integration Tests", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api", mlRoutes);
  });

  it("should handle complete flow from route to service", async () => {
    const mockResult = [
      { trialId: 1, matchScore: 0.95, trialName: "Diabetes Study" },
      { trialId: 2, matchScore: 0.87, trialName: "Hypertension Study" },
    ];
    mlService.runPythonScript.mockResolvedValue(mockResult);

    const patientData = {
      age: 45,
      diseases: ["Diabetes", "Hypertension"],
      gender: "Male",
      location: "New York",
    };

    const response = await request(app)
      .post("/api/match-trials")
      .send(patientData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.matches).toEqual(mockResult);
    expect(mlService.runPythonScript).toHaveBeenCalledWith({
      patient: patientData,
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

  it("should handle edge cases in complete flow", async () => {
    mlService.runPythonScript.mockResolvedValue([]);

    const patientData = {
      age: 100,
      diseases: ["Rare Disease"],
      gender: "Other",
    };

    const response = await request(app)
      .post("/api/match-trials")
      .send(patientData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.matches).toEqual([]);
  });
});

// ===========================================
// PERFORMANCE TESTS
// ===========================================
describe("Performance Tests", () => {
  it("should handle multiple concurrent requests", async () => {
    const app = express();
    app.use(express.json());
    app.use("/api", mlRoutes);

    mlService.runPythonScript.mockResolvedValue([]);

    const requests = Array(5)
      .fill()
      .map((_, i) =>
        request(app)
          .post("/api/match-trials")
          .send({ age: 30 + i, diseases: ["Test"] })
      );

    const responses = await Promise.all(requests);

    responses.forEach((response) => {
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
