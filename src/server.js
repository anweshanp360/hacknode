// server.js
const express = require('express');
const cors = require('cors');
const patientRoutes = require('./routes/patient.routes');
const trialRoutes = require('./routes/trial.routes');
const mlIntegrationRoutes = require('./routes/mlIntegration.routes');
const matchRoutes = require('./routes/matchRoutes');
const matchPatients = require('./routes/matchedpatientRoutes') // Assuming you have a match.routes.js file
const { poolPromise } = require('./db/config'); // Assuming db/config.js handles SQL Server connection pool

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Register API Routes
// These routes will handle the specific logic for patients, trials, and ML integration.
app.use('/api/patients', patientRoutes);
app.use('/api/trials', trialRoutes);
app.use('/api', mlIntegrationRoutes); 
app.use('/api', matchRoutes);
app.use('/api', matchPatients);

// Database connection test and server start
// The server will only start listening for requests once the SQL Server connection pool is ready.
poolPromise
    .then(() => {
        console.log('✅ SQL Server connected successfully');
        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ SQL Server connection failed at startup:', err);
        // It's crucial to exit the process if the database connection fails,
        // as the application cannot function without it.
        process.exit(1);
    });
