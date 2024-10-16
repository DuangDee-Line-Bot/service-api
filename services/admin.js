import { getOTP } from "./otp.js";
import { replyText, handleCommonEvent } from "./utils.js";

export const handleEvent = async (event, adminGroupId) => {
  if (!event.source.groupId || event.source.groupId !== process.env.groupId) {
    return replyText(
      event.replyToken,
      "ใช้ได้แค่ในกลุ่มของ Admin น้ะจ้ะ",
      event.message?.quoteToken,
      true
    );
  }

  if (event.type === "message") {
    return handleMessage(event.message, event.replyToken);
  }

  return handleCommonEvent(event, event.replyToken);
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
        true
      );
    default:
      throw new Error(`Unknown message type: ${JSON.stringify(message)}`);
  }
};

const handleText = async (message, replyToken) => {
  const otp = await getOTP();
  console.log("handleText");
  console.log(otp);

  if (otp.length > 0) {
    console.log(otp[otp.length - 1].otp);

    return replyText(
      replyToken,
      otp[otp.length - 1].otp,
      message.quoteToken,
      true
    );
  } else {
    console.error("OTP array is empty!");
    return replyText(replyToken, "No OTP found", message.quoteToken, true);
  }
};
