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
const usedOtp = (req, res) => {
  const { otp } = req.body;
  const result = otpService.markOtpAsUsed(otp);

  if (result.error) {
    return res
      .status(result.error === "OTP not found" ? 404 : 400)
      .json({ message: result.error });
  }

  return res.status(200).json(result);
};
export { getOtp, usedOtp };
