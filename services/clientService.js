// clientService.js
import { replyText, handleCommonEvent } from "./botUtils";
import otpService from "../services/otpService";
import fileStorage from "../services/fileStorage";

export const handleEvent = async (event) => {
  const otp = await otpService.fetchOTP();
  const globalOtp = await otpService.getGlobalOTP();
  const localOtp = fileStorage.readStorage();

  if (localOtp && !otp.find((otps) => otps.otp === localOtp.otp)) {
    fileStorage.writeStorage("");
    return replyText(
      event.replyToken,
      "OTP หมดอายุแล้ว\nโปรดส่งรหัส OTP ใหม่",
      event.message.quoteToken,
    );
  }

  if (globalOtp.find((otps) => otps.otp === event.message.text)) {
    fileStorage.writeStorage({ otp: event.message.text });
    return replyText(
      event.replyToken,
      "OTP ของคุณถูกต้อง",
      event.message.quoteToken,
    );
  }

  return handleMessageEvent(event);
};

const handleMessageEvent = (event) => {
  switch (event.type) {
    case "message":
      return handleMessage(event.message, event.replyToken);
    default:
      return handleCommonEvent(event, event.replyToken);
  }
};

const handleMessage = (message, replyToken) => {
  switch (message.type) {
    case "text":
      return handleText(message, replyToken);
    case "image":
    case "video":
    case "audio":
    case "location":
    case "sticker":
      return replyText(
        replyToken,
        `Got ${message.type.charAt(0).toUpperCase() + message.type.slice(1)}`,
      );
    default:
      throw new Error(`Unknown message type: ${JSON.stringify(message)}`);
  }
};

const handleText = async (message, replyToken) => {
  const data = await otpService.fetchData();
  const foundData = await otpService.findData(message.text, data);
  return replyText(replyToken, foundData, message.quoteToken);
};
