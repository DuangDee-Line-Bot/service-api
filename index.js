const express = require("express");

const fs = require("fs");
const randomstring = require("randomstring");
const cron = require("node-cron");
const app = express();

const port = 8070; // You can change the port as needed

function generateOTP() {
  const randomStr = randomstring.generate({
    length: 5,
    charset: "alphanumeric",
    capitalization: "uppercase",
    readable: true,
  });
  return randomStr;
}
let otp = generateOTP();
let otpExpiry = Date.now() + 300000;
// Middleware to parse JSON requests
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.get("/api/data", (req, res) => {
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Error reading data");
    } else {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    }
  });
});
cron.schedule("*/3 * * * *", () => {
  otp = generateOTP();
  otpExpiry = Date.now() + 180000; // Reset expiry time
  console.log(`New OTP generated: ${otp}`);
});
app.get("/api/otp", (req, res) => {
  if (Date.now() > otpExpiry) {
    res.status(400).send({ message: "OTP has expired" });
  } else {
    res.send({ otp: otp, expiry: new Date(otpExpiry).toISOString() });
  }

  // Schedule the API endpoint to be re-executed every 1 minute
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
