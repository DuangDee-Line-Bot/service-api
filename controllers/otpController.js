import { generatedOtps, validateOTP } from "../services/otpService.js";

const getOtp = () => {
  validateOTP();
  const otps = generatedOtps();
};

export { getOtp };