import line from "@line/bot-sdk";

const getLineClient = (isAdmin) => {
    const config = isAdmin
        ? {
            channelAccessToken: process.env.ADMIN_CHANNEL_ACCESS_TOKEN,
        }
        : {
            channelAccessToken: process.env.CLIENT_CHANNEL_ACCESS_TOKEN,
        };

    return new line.messagingApi.MessagingApiClient(config);
};


export const replyText = (replyToken, text, quoteToken, isAdmin = false) => {
    const client = getLineClient(isAdmin);

    return client.replyMessage({
        replyToken,
        messages: [{ type: "text", text, quoteToken }],
    });
};

export const handleCommonEvent = (event, replyToken) => {
    switch (event.type) {
        case "follow":
            return replyText(replyToken, "Got followed event");
        case "unfollow":
            console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);
            break;
        case "join":
            return replyText(replyToken, `Joined ${event.source.type}`);
        case "leave":
            console.log(`Left: ${JSON.stringify(event)}`);
            break;
        case "postback":
            return replyText(replyToken, `Got postback: ${event.postback.data}`);
        case "beacon":
            const dm = Buffer.from(event.beacon.dm || "", "hex").toString("utf8");
            return replyText(
                replyToken,
                `${event.beacon.type} beacon hwid: ${event.beacon.hwid} with device message: ${dm}`,
            );
        default:
            throw new Error(`Unknown event: ${JSON.stringify(event)}`);
    }
};