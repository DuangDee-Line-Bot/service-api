import { getOTP, findData, getGlobalOTP } from "./otp.js";
import { getData } from "./data.js";

import { getStorage, postStorage } from "./fileStorage.js";
import { replyText, handleCommonEvent } from "./utils.js";

const localOtp = getStorage();

export const handleEvent = async (event) => {
  const otp = await getOTP();
  const globalOtp = await getGlobalOTP();
  console.log(localOtp);

  if (localOtp && !otp.find((otps) => otps.otp === localOtp.otp)) {
    postStorage("");
    return replyText(
      event.replyToken,
      "OTP หมดอายุแล้ว\nโปรดส่งรหัส OTP ใหม่",
      event.message.quoteToken
    );
  }

  if (globalOtp.find((otps) => otps.otp === event.message.text)) {
    postStorage({ otp: event.message.text });
    return replyText(
      event.replyToken,
      "OTP ของคุณถูกต้อง",
      event.message.quoteToken,
      false
    );
  }

  return handleMessageEvent(event);
};

const handleMessageEvent = (event) => {
  if (localOtp !== "") {
    switch (event.type) {
      case "message":
        return handleMessage(event.message, event.replyToken);
      default:
        return handleCommonEvent(event, event.replyToken);
    }
  } else {
    return replyText(
      event.replyToken,
      "OTP ไม่ตรงกันหรืออาจหมดอายุ\nโปรดส่งรหัส OTP ใหม่อีกครั้ง",
      event.message.quoteToken
    );
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
        `Got ${message.type.charAt(0).toUpperCase() + message.type.slice(1)}`
      );
    default:
      throw new Error(`Unknown message type: ${JSON.stringify(message)}`);
  }
};

const handleText = async (message, replyToken) => {
  const data = await getData();
  const foundData = await findData(message.text, data);
  return replyText(replyToken, foundData, message.quoteToken);
};
