import line from "@line/bot-sdk";
import otpService from "../services/otpService";

const config = {
    channelAccessToken: process.env.channelAccessToken,
    channelSecret: process.env.channelSecret,
};

const client = new line.messagingApi.MessagingApiClient(config);


export const replyText = (replyToken, text, quoteToken) => {
    return client.replyMessage({
        replyToken,
        messages: [
            {
                type: "text",
                text,
                quoteToken,
            },
        ],
    });
};


export const handleEvent = async (event, adminGroupId) => {
    if (event.source.groupId === adminGroupId) {
        console.log(event);
        switch (event.type) {
            case "message":
                return handleMessage(event.message, event.replyToken);
            case "follow":
                return replyText(event.replyToken, "Got followed event");
            case "unfollow":
                return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);
            case "join":
                return replyText(event.replyToken, `Joined ${event.source.type}`);
            case "leave":
                return console.log(`Left: ${JSON.stringify(event)}`);
            case "postback":
                return replyText(event.replyToken, `Got postback: ${event.postback.data}`);
            case "beacon":
                const dm = Buffer.from(event.beacon.dm || "", "hex").toString("utf8");
                return replyText(event.replyToken, `${event.beacon.type} beacon hwid: ${event.beacon.hwid} with device message: ${dm}`);
            default:
                throw new Error(`Unknown event: ${JSON.stringify(event)}`);
        }
    } else {
        return replyText(event.replyToken, "ใช้ได้แค่ในกลุ่มของ Admin น้ะจ้ะ", event.message?.quoteToken);
    }
};


const handleMessage = (message, replyToken) => {
    switch (message.type) {
        case "text":
            return handleText(message, replyToken);
        case "image":
            return replyText(replyToken, "Got Image");
        case "video":
            return replyText(replyToken, "Got Video");
        case "audio":
            return replyText(replyToken, "Got Audio");
        case "location":
            return replyText(replyToken, "Got Location");
        case "sticker":
            return replyText(replyToken, "Got Sticker");
        default:
            throw new Error(`Unknown message type: ${JSON.stringify(message)}`);
    }
};


const handleText = async (message, replyToken) => {
    console.log("handleText");

    const otp = await otpService.getOTP(); // Ensure this returns an array
    if (otp.length > 0) {
        console.log(otp.length); // Log the number of elements in the array
        return replyText(replyToken, otp[otp.length - 1].otp, message.quoteToken);
    } else {
        console.error("OTP array is empty!");
        return replyText(replyToken, "No OTP found", message.quoteToken);
    }
};
