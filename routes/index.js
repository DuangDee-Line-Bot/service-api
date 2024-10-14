import express from "express";
import { getOtp } from "../controllers/otpController.js";
import { getHome, getData } from "../controllers/dataController.js";
import { handleAdminWebhook } from "../controllers/lineAdminController.js";
import { handleClientWebhook } from "../controllers/lineClientController.js";

const router = express.Router();

const clientConfig = {
  channelAccessToken: process.env.CLIENT_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CLIENT_CHANNEL_SECRET,
};

const adminConfig = {
  channelAccessToken: process.env.ADMIN_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.ADMIN_CHANNEL_SECRET,
};

router.get("/", getHome); // Testing
router.get("/api/data", getData);
router.get("/api/otp", getOtp);
router.get(
  "/api/client-webhook",
  middleware(clientConfig),
  handleClientWebhook,
);
router.get("/api/admin-webhook", middleware(adminConfig), handleAdminWebhook);

export default router;
