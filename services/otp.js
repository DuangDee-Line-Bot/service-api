import randomstring from "randomstring";
import "dotenv/config";
import cron from "node-cron";

let otp = null;
let expiry = null;
let createdDate = null;
let isUsed = false;

let otps = [];
let globalOtp = null;
let otpLength = 0;
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
  createdDate = Date.now();
  isUsed = false;

  // console.log(
  //   `New OTP generated: ${otp}, expires at: ${new Date(expiry).toISOString()}`
  // );
};

export const validateOTP = () => {
  const currentOtp = otp;
  regenerateOTP();
  otps.forEach((otp, index) => {
    if (new Date(otp.expiry) < Date.now()) {
      otps.splice(index, 1);
    }
  });
  return {
    otp: currentOtp,
    expiry: new Date(expiry).toISOString(),
    createdDate: new Date(createdDate).toISOString(),
    isUsed,
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

export const getOTP = async () => {
  try {
    const url = `${process.env.API_URL}/api/otp`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch OTP: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    otpLength = data.length;
    globalOtp = data;
    return data;
  } catch (error) {
    console.error("Error fetching OTP:", error.message);
    return null;
  }
};

export const getOTPLength = () => otpLength;

export const getGlobalOTP = async () => globalOtp;

export const markOtpAsUsed = async (otp) => {
  const otps = await getOTP();
  console.log("otps");
  console.log(otps);
  const otpObject = otps.find((o) => o.otp === otp);

  if (!otpObject) {
    return { error: "OTP not found" };
  }

  if (otpObject.isUsed) {
    return { error: "OTP is already used" };
  }

  otpObject.isUsed = true;
  console.log("otpObject");
  console.log(otpObject);

  return otpObject;
};
export const updateOtpStatus = (otp) => {
  const index = otps.findIndex((item) => item.otp === otp);
  if (index !== -1) {
    otps[index].isUsed = true; // Mark the OTP as used
    return otps[index]; // Return the updated OTP
  }
  throw new Error("OTP not found"); // Handle not found case
};
export const updateOtpAsUsed = async (otp) => {
  try {
    const url = `${process.env.API_URL}/api/otp/`;
    console.log(`OTP to mark as used: ${otp}`);

    const response = await fetch(url + otp, {
      method: "PUT", // Ensure you use PUT here
      headers: {
        "Content-Type": "application/json", // Specify the content type if needed
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    const data = await response.json();
    return data; // Return the successful response
  } catch (error) {
    console.error("Error marking OTP as used:", error.message);
    throw error; // Rethrow error to be handled by the caller
  }
};

export const findData = async (responseMessage, jsonData) => {
  const matchedItem = jsonData.find((x) => x.key === responseMessage);

  if (matchedItem) {
    return (
      matchedItem.Aspect +
      "\n\n" +
      matchedItem.TH +
      "\n\n" +
      matchedItem.CH +
      "\n\n" +
      matchedItem.ENG
    );
  } else {
    return "ไม่พบข้อมูลที่ตรงกัน";
  }
};
