import randomstring from "randomstring";
import dotenv from "dotenv";
import cron from "node-cron";

dotenv.config();

let otp = null;
let expiry = null;
let otps = [];
export const generateOTP = () => {
  return randomstring.generate({
    length: parseInt(process.env.OTP_LENGTH) || 5,
    charset: "alphanumeric",
    capitalization: "uppercase",
    readable: true,
  });
};

// Function to regenerate OTP and expiry
export const regenerateOTP = () => {
  otp = generateOTP();
  expiry = Date.now() + parseInt(process.env.OTP_EXPIRY || 180000); // Default 3 minutes

  console.log(
    `New OTP generated: ${otp}, expires at: ${new Date(expiry).toISOString()}`
  );
};

// Function to validate the current OTP
export const validateOTP = () => {
  const hasExpired = Date.now() > expiry;
  const currentOtp = otp;
  regenerateOTP(); // Immediately generate a new OTP after the user gets the current one.
  otps.forEach((otp, index) => {
    if (new Date(otp.expiry) < Date.now()) {
      otps.splice(index, 1);
    }
  });
  return {
    otp: currentOtp,
    expiry: new Date(expiry).toISOString(),
    hasExpired,
  };
};
export const generatedOtps = () => {
  otps.push(validateOTP());
  return otps;
};
cron.schedule("*/1 * * * *", () => {
  otps.forEach((otp, index) => {
    if (new Date(otp.expiry) < Date.now()) {
      otps.splice(index, 1);
    }
  });
});
// Initialize first OTP
regenerateOTP();
