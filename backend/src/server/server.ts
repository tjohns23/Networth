// 1. Environment Setup - MUST be the absolute first import
// This file loads .env variables and makes them available to the entire app before any other code runs.
import './config/env.js';

// 2. Third-Party Imports
import express from 'express';
import cors from 'cors';

// 3. Application-Specific Imports
import contactRoutes from "./routes/contactRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import frameworkRoutes from "./routes/frameworkRoutes.js";
import connectDB from './config/db.js';

// --- Main Application Logic ---

const startServer = async () => {
  try {
    // 4. Establish Database Connection
    // It's best practice to ensure the database is connected *before* starting the web server.
    await connectDB();
    console.log("Successfully connected to the database.");

    // 5. Initialize Express App
    const app = express();

    // 6. Core Middleware
    // Enable Cross-Origin Resource Sharing for all routes
    app.use(cors());
    // Enable the Express app to parse JSON-formatted request bodies
    app.use(express.json());

    // 7. Route Middleware
    // All routes for '/api/contacts' will be handled by the contactRoutes router
    app.use("/api/contacts", contactRoutes);
    // All routes for '/auth' will be handled by the authRoutes router
    app.use('/auth', authRoutes);
    // All routes with '/framework will be handled by the frameworkRoutes router
    app.use('/api/frameworks', frameworkRoutes);

    // 8. Define Port and Start Server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      // A more descriptive startup log
      console.log(`Server is running in '${process.env.NODE_ENV || 'development'}' mode on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start the server.");
    console.error(error);
    // Exit the process with a failure code if we can't start up
    process.exit(1);
  }
};

// Execute the async function to start the application
startServer();