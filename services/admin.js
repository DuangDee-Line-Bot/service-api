import { getOTP } from './otp.js';
import { replyText, handleCommonEvent } from './utils.js';

export const handleEvent = async (event, adminGroupId) => {
    console.log("Hello")
    if (event.source.groupId !== adminGroupId) {
        return replyText(
            event.replyToken,
            "ใช้ได้แค่ในกลุ่มของ Admin น้ะจ้ะ",
            event.message?.quoteToken,
        );
    }

    console.log(event);

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
    console.log("handleText");
    const otp = await getOTP();

    if (otp.length > 0) {
        return replyText(replyToken, otp[otp.length - 1].otp, message.quoteToken);
    } else {
        console.error("OTP array is empty!");
        return replyText(replyToken, "No OTP found", message.quoteToken);
    }
};
