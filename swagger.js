// swagger.js - Main Swagger configuration file

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

// Basic Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Clinical Trials API",
    version: "1.0.0",
    description:
      "A comprehensive API for managing clinical trials, patients, and ML integration services",
    contact: {
      name: "API Support",
      email: "support@clinicaltrials.com",
      url: "https://clinicaltrials.com/support",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
    {
      url: "https://api.clinicaltrials.com",
      description: "Production server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      apiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "X-API-Key",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          message: {
            type: "string",
            example: "Error message",
          },
          error: {
            type: "string",
            example: "Detailed error information",
          },
        },
      },
      Patient: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "patient-123",
          },
          firstName: {
            type: "string",
            example: "John",
          },
          lastName: {
            type: "string",
            example: "Doe",
          },
          email: {
            type: "string",
            format: "email",
            example: "john.doe@example.com",
          },
          phone: {
            type: "string",
            example: "+1-555-123-4567",
          },
          dateOfBirth: {
            type: "string",
            format: "date",
            example: "1980-01-15",
          },
          gender: {
            type: "string",
            enum: ["male", "female", "other"],
            example: "male",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2023-01-15T10:30:00Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2023-01-15T10:30:00Z",
          },
        },
      },
      Trial: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "trial-123",
          },
          title: {
            type: "string",
            example: "Phase II Study of Novel Diabetes Treatment",
          },
          description: {
            type: "string",
            example: "A randomized, double-blind, placebo-controlled study",
          },
          nctId: {
            type: "string",
            example: "NCT12345678",
          },
          status: {
            type: "string",
            enum: [
              "recruiting",
              "active",
              "completed",
              "suspended",
              "terminated",
            ],
            example: "recruiting",
          },
          phase: {
            type: "string",
            enum: ["Phase I", "Phase II", "Phase III", "Phase IV"],
            example: "Phase II",
          },
          condition: {
            type: "string",
            example: "Type 2 Diabetes",
          },
          intervention: {
            type: "string",
            example: "Experimental Drug XYZ-123",
          },
          primaryOutcome: {
            type: "string",
            example: "Change in HbA1c levels from baseline to 12 weeks",
          },
          enrollmentTarget: {
            type: "integer",
            example: 200,
          },
          currentEnrollment: {
            type: "integer",
            example: 45,
          },
          startDate: {
            type: "string",
            format: "date",
            example: "2023-01-15",
          },
          estimatedCompletionDate: {
            type: "string",
            format: "date",
            example: "2025-12-31",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2023-01-15T10:30:00Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2023-01-15T10:30:00Z",
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

// Options for swagger-jsdoc
const options = {
  definition: swaggerDefinition,
  apis: [
    "./src/routes/*.js",
    "./routes/*.js",
    "./src/controllers/*.js",
    "./controllers/*.js",
    "./src/models/*.js",
    "./models/*.js",
  ],
};

// Initialize swagger-jsdoc
const specs = swaggerJSDoc(options);

// Custom CSS for Swagger UI
const customCss = `
  .swagger-ui .topbar { display: none; }
  .swagger-ui .info { margin: 20px 0; }
  .swagger-ui .scheme-container { margin: 20px 0; }
  .swagger-ui .info .title { color: #2c3e50; }
  .swagger-ui .btn.authorize { 
    background-color: #3498db; 
    border-color: #3498db; 
  }
  .swagger-ui .btn.authorize:hover { 
    background-color: #2980b9; 
    border-color: #2980b9; 
  }
`;

// Custom site title
const customSiteTitle = "Clinical Trials API Documentation";

// Swagger UI options
const swaggerUiOptions = {
  customCss,
  customSiteTitle,
  customfavIcon: "/favicon.ico",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: "none",
    filter: true,
    showRequestHeaders: true,
    tryItOutEnabled: true,
  },
};

module.exports = {
  specs,
  swaggerUi,
  swaggerUiOptions,
};
