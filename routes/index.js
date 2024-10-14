import express from 'express';
import { getOtp } from '../controllers/otpController.js';
import { getHome, getData } from '../controllers/dataController.js';
import { handleAdminWebhook } from '../controllers/lineAdminController.js';
import { handleClientWebhook } from '../controllers/lineClientController.js';
const router = express.Router();

router.get('/', getHome); // Testing
router.get('/api/data', getData);
router.get('/api/otp', getOtp);
router.get('/api/client-webhook', handleClientWebhook);
router.get('/api/admin-webhook', handleAdminWebhook);

export default router;
