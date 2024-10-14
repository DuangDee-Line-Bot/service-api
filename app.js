import "dotenv/config";
import express from "express";
import cron from "node-cron";
import routes from "./routes/index.js";
import { regenerateOTP, getOTP } from "./services/otpService.js";

const app = express();
const port = process.env.PORT || 8070;

app.use(express.json());

app.use("/", routes);

// Schedule OTP regeneration every 3 minutes
cron.schedule("*/3 * * * *", regenerateOTP);
cron.schedule("*/3 * * * *", getOTP); // For Testing

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
