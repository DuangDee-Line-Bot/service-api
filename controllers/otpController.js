import { generatedOtps, validateOTP } from "../services/otpService.js";

const getOtp = (req, res) => {
  const { hasExpired } = validateOTP();
  let dateNow = Date.now();
  const otps = generatedOtps();
  res.send(otps);
};

export { getOtp };
