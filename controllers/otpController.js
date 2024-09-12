import { validateOTP } from '../services/otpService.js';

// TODO:
export const getOtp = (req, res) => {
    const { otp, expiry, hasExpired } = validateOTP();
    if (hasExpired) {
        res.status(400).send({ message: "OTP has expired" });
    } else {
        res.send({ otp, expiry });
    }
};
