// swagger-comments-examples.js - Examples of Swagger comments for your routes

// Example 1: Patient Routes with Swagger comments
// Add these comments to your patient.routes.js file

/**
 * @swagger
 * components:
 *   schemas:
 *     PatientInput:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - dateOfBirth
 *         - gender
 *       properties:
 *         firstName:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           example: John
 *         lastName:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           example: Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         phone:
 *           type: string
 *           example: +1-555-123-4567
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: 1980-01-15
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           example: male
 */

/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Get all patients
 *     description: Retrieve a paginated list of all patients in the system
 *     tags: [Patients]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of patients per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for patient name or email
 *     responses:
 *       200:
 *         description: Successfully retrieved patients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Patient'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Create a new patient
 *     description: Add a new patient to the system
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatientInput'
 *     responses:
 *       201:
 *         description: Patient created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Patient created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Patient'
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Patient already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     summary: Get patient by ID
 *     description: Retrieve a specific patient by their unique identifier
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *         example: patient-123
 *     responses:
 *       200:
 *         description: Successfully retrieved patient
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Patient'
 *       404:
 *         description: Patient not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Update patient by ID
 *     description: Update an existing patient's information
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *         example: patient-123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatientInput'
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Patient updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Patient'
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Patient not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete patient by ID
 *     description: Remove a patient from the system
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *         example: patient-123
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Patient deleted successfully
 *       404:
 *         description: Patient not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Example 2: Trial Routes with Swagger comments
// Add these comments to your trial.routes.js file

/**
 * @swagger
 * components:
 *   schemas:
 *     TrialInput:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - status
 *         - phase
 *         - condition
 *         - intervention
 *         - primaryOutcome
 *       properties:
 *         title:
 *           type: string
 *           minLength: 10
 *           maxLength: 200
 *           example: Phase II Study of Novel Diabetes Treatment
 *         description:
 *           type: string
 *           minLength: 50
 *           maxLength: 1000
 *           example: A randomized, double-blind, placebo-controlled study
 *         nctId:
 *           type: string
 *           pattern: '^NCT[0-9]{8}$'
 *           example: NCT12345678
 *         status:
 *           type: string
 *           enum: [recruiting, active, completed, suspended, terminated]
 *           example: recruiting
 *         phase:
 *           type: string
 *           enum: [Phase I, Phase II, Phase III, Phase IV]
 *           example: Phase II
 *         condition:
 *           type: string
 *           example: Type 2 Diabetes
 *         intervention:
 *           type: string
 *           example: Experimental Drug XYZ-123
 *         primaryOutcome:
 *           type: string
 *           example: Change in HbA1c levels from baseline to 12 weeks
 *         enrollmentTarget:
 *           type: integer
 *           minimum: 1
 *           maximum: 10000
 *           example: 200
 */

/**
 * @swagger
 * /api/trials:
 *   get:
 *     summary: Get all trials
 *     description: Retrieve a list of all clinical trials
 *     tags: [Trials]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [recruiting, active, completed, suspended, terminated]
 *         description: Filter trials by status
 *       - in: query
 *         name: phase
 *         schema:
 *           type: string
 *           enum: [Phase I, Phase II, Phase III, Phase IV]
 *         description: Filter trials by phase
 *       - in: query
 *         name: condition
 *         schema:
 *           type: string
 *         description: Filter trials by medical condition
 *     responses:
 *       200:
 *         description: Successfully retrieved trials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Trial'
 *   post:
 *     summary: Create a new trial
 *     description: Create a new clinical trial
 *     tags: [Trials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TrialInput'
 *     responses:
 *       201:
 *         description: Trial created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Trial created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Trial'
 */

// Example 3: ML Integration Routes with Swagger comments
// Add these comments to your mlIntegration.routes.js file

/**
 * @swagger
 * /api/match-trials:
 *   post:
 *     summary: Match trials using ML algorithm
 *     description: Find suitable clinical trials for a patient using machine learning
 *     tags: [ML Integration]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - criteria
 *             properties:
 *               patientId:
 *                 type: string
 *                 description: Unique identifier for the patient
 *                 example: patient-123
 *               criteria:
 *                 type: object
 *                 description: Matching criteria for trial selection
 *                 properties:
 *                   age:
 *                     type: integer
 *                     minimum: 0
 *                     maximum: 150
 *                     example: 45
 *                   gender:
 *                     type: string
 *                     enum: [male, female, other]
 *                     example: female
 *                   condition:
 *                     type: string
 *                     example: diabetes
 *                   location:
 *                     type: string
 *                     example: New York
 *               preferences:
 *                 type: object
 *                 properties:
 *                   maxDistance:
 *                     type: number
 *                     example: 50
 *                   trialPhase:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [Phase I, Phase II, Phase III, Phase IV]
 *                     example: [Phase II, Phase III]
 *     responses:
 *       200:
 *         description: Successfully matched trials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Trials matched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     patientId:
 *                       type: string
 *                       example: patient-123
 *                     matchedTrials:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           trialId:
 *                             type: string
 *                             example: trial-456
 *                           title:
 *                             type: string
 *                             example: Diabetes Treatment Study
 *                           matchScore:
 *                             type: number
 *                             minimum: 0
 *                             maximum: 1
 *                             example: 0.89
 *                           location:
 *                             type: string
 *                             example: New York Medical Center
 *                           phase:
 *                             type: string
 *                             example: Phase II
 *                     totalMatches:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Patient not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
