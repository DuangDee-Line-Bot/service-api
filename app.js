import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cron from 'node-cron';
import routes from './routes/index.js';
import { regenerateOTP } from './services/otpService.js';

const app = express();
const port = process.env.PORT || 8070;

// Middleware to parse JSON requests
app.use(express.json());

// Load routes
app.use('/', routes);

// Schedule OTP regeneration every 3 minutes
cron.schedule('*/3 * * * *', regenerateOTP);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
