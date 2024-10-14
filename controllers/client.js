import "dotenv/config";
import { handleEvent } from "../services/client.js";

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
