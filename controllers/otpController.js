import { generatedOtps, validateOTP } from "../services/otpService.js";

// TODO:
export const getOtp = (req, res) => {
  const { hasExpired } = validateOTP();
  let dateNow = Date.now();
  const otps = generatedOtps();
  res.send(otps);

  // if (hasExpired) {
  //   res.status(400).send({ message: "OTP has expired" });
  // } else {
  //   res.send(otps);
  // }
};
