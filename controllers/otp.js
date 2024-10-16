import { generatedOtps, validateOTP } from "../services/otp.js";

const getOtp = (req, res) => {
  try {
    validateOTP();
    const otps = generatedOtps();
    res.json(otps);
  } catch (err) {
    res.status(500).send("Error reading data");
  }
};

export { getOtp };
