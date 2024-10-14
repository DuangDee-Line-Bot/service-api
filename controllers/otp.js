import { generatedOtps, validateOTP } from "../services/otp.js";

const getOtp = () => {
  validateOTP();
  const otps = generatedOtps();
};

export { getOtp };