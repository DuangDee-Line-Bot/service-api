import express from 'express';
import { getOtp } from '../controllers/otpController.js';
import { getHome, getData } from '../controllers/dataController.js';

const router = express.Router();

router.get('/', getHome);
router.get('/api/data', getData);
router.get('/api/otp', getOtp);

export default router;
