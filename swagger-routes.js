// swagger-routes.js - Route handlers for Swagger documentation

const express = require("express");
const router = express.Router();
const { specs, swaggerUi, swaggerUiOptions } = require("./swagger");

// Serve Swagger UI
router.use("/api-docs", swaggerUi.serve);
router.get("/api-docs", swaggerUi.setup(specs, swaggerUiOptions));

// Serve Swagger JSON
router.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(specs);
});

// Health check endpoint for API documentation
router.get("/docs/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    documentation: {
      swagger: "/api-docs",
      json: "/api-docs.json",
      postman: "/docs/postman",
    },
  });
});

// Generate Postman collection
router.get("/docs/postman", (req, res) => {
  const postmanCollection = {
    info: {
      name: "Clinical Trials API",
      description: "API collection for Clinical Trials management",
      version: "1.0.0",
      schema:
        "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    },
    auth: {
      type: "bearer",
      bearer: [
        {
          key: "token",
          value: "{{jwt_token}}",
          type: "string",
        },
      ],
    },
    variable: [
      {
        key: "baseUrl",
        value: "http://localhost:3000",
        type: "string",
      },
      {
        key: "jwt_token",
        value: "your-jwt-token-here",
        type: "string",
      },
    ],
    item: [
      {
        name: "Patients",
        item: [
          {
            name: "Get All Patients",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: "{{baseUrl}}/api/patients",
                host: ["{{baseUrl}}"],
                path: ["api", "patients"],
              },
            },
          },
          {
            name: "Get Patient by ID",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: "{{baseUrl}}/api/patients/:id",
                host: ["{{baseUrl}}"],
                path: ["api", "patients", ":id"],
                variable: [
                  {
                    key: "id",
                    value: "patient-123",
                  },
                ],
              },
            },
          },
          {
            name: "Create Patient",
            request: {
              method: "POST",
              header: [
                {
                  key: "Content-Type",
                  value: "application/json",
                },
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    firstName: "John",
                    lastName: "Doe",
                    email: "john.doe@example.com",
                    phone: "+1-555-123-4567",
                    dateOfBirth: "1980-01-15",
                    gender: "male",
                  },
                  null,
                  2
                ),
              },
              url: {
                raw: "{{baseUrl}}/api/patients",
                host: ["{{baseUrl}}"],
                path: ["api", "patients"],
              },
            },
          },
        ],
      },
      {
        name: "Trials",
        item: [
          {
            name: "Get All Trials",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: "{{baseUrl}}/api/trials",
                host: ["{{baseUrl}}"],
                path: ["api", "trials"],
              },
            },
          },
          {
            name: "Create Trial",
            request: {
              method: "POST",
              header: [
                {
                  key: "Content-Type",
                  value: "application/json",
                },
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    title: "Phase II Study of Novel Diabetes Treatment",
                    description:
                      "A randomized, double-blind, placebo-controlled study",
                    status: "recruiting",
                    phase: "Phase II",
                    condition: "Type 2 Diabetes",
                    intervention: "Experimental Drug XYZ-123",
                    primaryOutcome:
                      "Change in HbA1c levels from baseline to 12 weeks",
                    enrollmentTarget: 200,
                  },
                  null,
                  2
                ),
              },
              url: {
                raw: "{{baseUrl}}/api/trials",
                host: ["{{baseUrl}}"],
                path: ["api", "trials"],
              },
            },
          },
        ],
      },
      {
        name: "ML Integration",
        item: [
          {
            name: "Match Trials",
            request: {
              method: "POST",
              header: [
                {
                  key: "Content-Type",
                  value: "application/json",
                },
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    patientId: "patient-123",
                    criteria: {
                      age: 45,
                      gender: "female",
                      condition: "diabetes",
                      location: "New York",
                    },
                    preferences: {
                      maxDistance: 50,
                      trialPhase: ["Phase II", "Phase III"],
                    },
                  },
                  null,
                  2
                ),
              },
              url: {
                raw: "{{baseUrl}}/api/match-trials",
                host: ["{{baseUrl}}"],
                path: ["api", "match-trials"],
              },
            },
          },
        ],
      },
    ],
  };

  res.setHeader("Content-Type", "application/json");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="clinical-trials-api.postman_collection.json"'
  );
  res.send(postmanCollection);
});

module.exports = router;
