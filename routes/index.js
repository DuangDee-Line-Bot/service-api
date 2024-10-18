import express from "express";
import { getOtp } from "../controllers/otp.js";
import { getHome, getData } from "../controllers/data.js";
import { handleAdminWebhook } from "../controllers/admin.js";
import { handleClientWebhook } from "../controllers/client.js";
import { usedOtp } from "../controllers/otp.js";

const router = express.Router();

router.get("/", getHome); // Testing
router.get("/api/data", getData);
router.get("/api/otp", getOtp);
router.post("/api/client-webhook", handleClientWebhook);
router.post("/api/admin-webhook", handleAdminWebhook);
router.post("/api/otp/used", usedOtp);
export default router;
