import line from "@line/bot-sdk"
import getService from "../services/getService"
import 'dotenv/config';


const config = {
    channelAccessToken: process.env.channelAccessToken,
    channelSecret: process.env.channelSecret,
};
const client = new line.messagingApi.MessagingApiClient(config);

export const handleAdminWebhook = (req, res) => {
    Promise.all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
};


const replyText = (replyToken, text, quoteToken) => {
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


function handleEvent(event) {
    if (event.source.groupId == process.env.groupId) {
        console.log(event);
        switch (event.type) {
            case "message":
                const message = event.message;
                switch (message.type) {
                    case "text":
                        return handleText(message, event.replyToken);
                    case "image":
                        return handleImage(message, event.replyToken);
                    case "video":
                        return handleVideo(message, event.replyToken);
                    case "audio":
                        return handleAudio(message, event.replyToken);
                    case "location":
                        return handleLocation(message, event.replyToken);
                    case "sticker":
                        return handleSticker(message, event.replyToken);
                    default:
                        throw new Error(`Unknown message: ${JSON.stringify(message)}`);
                }

            case "follow":
                return replyText(event.replyToken, "Got followed event");

            case "unfollow":
                return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

            case "join":
                return replyText(event.replyToken, `Joined ${event.source.type}`);

            case "leave":
                return console.log(`Left: ${JSON.stringify(event)}`);

            case "postback":
                let data = event.postback.data;
                return replyText(event.replyToken, `Got postback: ${data}`);

            case "beacon":
                const dm = `${Buffer.from(event.beacon.dm || "", "hex").toString(
                    "utf8"
                )}`;
                return replyText(
                    event.replyToken,
                    `${event.beacon.type} beacon hwid : ${event.beacon.hwid} with device message = ${dm}`
                );

            default:
                throw new Error(`Unknown event: ${JSON.stringify(event)}`);
        }
    } else {
        return replyText(
            event.replyToken,
            "ใช้ได้แค่ในกลุ่มของ Admin น้ะจ้ะ",
            event.message.quoteToken
        );
    }
}

async function handleText(message, replyToken) {
    console.log("handleText");

    const otp = await getService.getOTP(); // Ensure this returns an array
    const otpLength = otp.length; // This gives the length of the array

    if (otpLength > 0) {
        console.log(otpLength); // This logs the number of elements in the array

        // Access the last element or modify this to fit your needs
        return replyText(replyToken, otp[otpLength - 1].otp, message.quoteToken);
    } else {
        console.error("OTP array is empty!");
        return replyText(replyToken, "No OTP found", message.quoteToken);
    }
}

function handleImage(message, replyToken) {
    return replyText(replyToken, "Got Image");
}

function handleVideo(message, replyToken) {
    return replyText(replyToken, "Got Video");
}

function handleAudio(message, replyToken) {
    return replyText(replyToken, "Got Audio");
}

function handleLocation(message, replyToken) {
    return replyText(replyToken, "Got Location");
}

function handleSticker(message, replyToken) {
    return replyText(replyToken, "Got Sticker");
}