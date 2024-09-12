import randomstring from 'randomstring';

let otp = null;
let expiry = null;

export const generateOTP = () => {
    return randomstring.generate({
        length: process.env.OTP_LENGTH || 5,
        charset: 'alphanumeric',
        capitalization: 'uppercase',
        readable: true,
    });
};

// Function to regenerate OTP and expiry
export const regenerateOTP = () => {
    otp = generateOTP();
    expiry = Date.now() + (process.env.OTP_EXPIRY || 180000); // Default 3 minutes
    console.log(`New OTP generated: ${otp}, expires at: ${new Date(expiry).toISOString()}`);
};

// Function to validate the current OTP
export const validateOTP = () => {
    const hasExpired = Date.now() > expiry;
    const currentOtp = otp;
    regenerateOTP(); // Immediately generate a new OTP after the user gets the current one.
    return { otp: currentOtp, expiry: new Date(expiry).toISOString(), hasExpired };
};

// Initialize first OTP
regenerateOTP();
