import { handleEvent } from '../services/adminService.js';
import 'dotenv/config';

// Handle LINE webhook events
export const handleAdminWebhook = (req, res) => {
    Promise.all(req.body.events.map((event) => handleEvent(event, req.body.groupId)))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
};
