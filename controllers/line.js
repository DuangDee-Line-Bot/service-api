import 'dotenv/config';

import line from "@line/bot-sdk";
import otpService from "../services/otp";

// dotenv.config();

const config = {
    channelAccessToken: process.env.channelAccessToken,
    channelSecret: process.env.channelSecret,
};

const client = new line.messagingApi.MessagingApiClient(config);

// Handle LINE webhook events
export const handleClientWebhook = async (req, res) => {
    try {
        const results = await Promise.all(req.body.events.map(handleEvent));
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
};

// Reply with text
const replyText = (replyToken, text, quoteToken) => {
    return client.replyMessage({
        replyToken,
        messages: [{ type: "text", text, quoteToken }],
    });
};

// Handle a single event
const handleEvent = async (event) => {
    const { type, replyToken, source, message } = event;

    if (source.groupId === process.env.groupId) {
        console.log(event);
        switch (type) {
            case "message":
                return handleMessage(message, replyToken);
            case "follow":
                return replyText(replyToken, "Got followed event");
            case "unfollow":
                return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);
            case "join":
                return replyText(replyToken, `Joined ${source.type}`);
            case "leave":
                return console.log(`Left: ${JSON.stringify(event)}`);
            case "postback":
                return replyText(replyToken, `Got postback: ${event.postback.data}`);
            case "beacon":
                const dm = Buffer.from(event.beacon.dm || "", "hex").toString("utf8");
                return replyText(replyToken, `${event.beacon.type} beacon hwid: ${event.beacon.hwid} with device message: ${dm}`);
            default:
                throw new Error(`Unknown event: ${JSON.stringify(event)}`);
        }
    } else {
        return replyText(replyToken, "ใช้ได้แค่ในกลุ่มของ Admin น้ะจ้ะ", message?.quoteToken);
    }
};

// Handle different message types
const handleMessage = async (message, replyToken) => {
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

// Handle text messages
const handleText = async (message, replyToken) => {
    console.log("handleText");

    const otpArray = await otpService.getOTP();
    if (otpArray.length > 0) {
        console.log(otpArray.length);
        return replyText(replyToken, otpArray[otpArray.length - 1].otp, message.quoteToken);
    } else {
        console.error("OTP array is empty!");
        return replyText(replyToken, "No OTP found", message.quoteToken);
    }
};
