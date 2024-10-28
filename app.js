import "dotenv/config";
import express from "express";
import cron from "node-cron";
import routes from "./routes/index.js";
import { regenerateOTP, getOTP } from "./services/otp.js";

import { middleware } from "@line/bot-sdk";

const app = express();
const port = process.env.PORT || 8070;

// Apply the LINE middleware first, only on specific routes
const clientConfig = {
  channelSecret: process.env.CLIENT_CHANNEL_SECRET,
};
const adminConfig = {
  channelSecret: process.env.ADMIN_CHANNEL_SECRET,
};

// Use the middleware for the webhook routes directly
app.use("/api/client-webhook", middleware(clientConfig));
app.use("/api/admin-webhook", middleware(adminConfig));

// Now, use express.json() for the rest of the app
app.use(express.json());

// Use the rest of the routes
app.use("/", routes);

// Schedule OTP regeneration every 3 minutes
// cron.schedule("*/3 * * * *", regenerateOTP);
cron.schedule("*/3 * * * *", getOTP); // For Testing

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
