import express from "express";

import { getOtp } from "../controllers/otp.js";
import { getHome, getData } from "../controllers/data.js";
import { handleAdminWebhook } from "../controllers/admin.js";
import { handleClientWebhook } from "../controllers/client.js";
import { middleware } from "@line/bot-sdk";

const router = express.Router();

const clientConfig = {
    channelSecret: process.env.CLIENT_CHANNEL_SECRET,
};

const adminConfig = {
    channelSecret: process.env.ADMIN_CHANNEL_SECRET,
};

router.get("/", getHome); // Testing
router.get("/api/data", getData);
router.get("/api/otp", getOtp);
router.post(
    "/api/client-webhook",
    middleware(clientConfig),
    handleClientWebhook,
);
router.post("/api/admin-webhook", middleware(adminConfig), handleAdminWebhook);

export default router;
