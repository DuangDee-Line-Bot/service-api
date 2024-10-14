// app.js
"use strict";

require("dotenv").config();
const express = require("express");
const { middleware } = require("@line/bot-sdk");
const bodyParser = require("body-parser");
const cron = require("node-cron");

const getService = require("./services/getService");

const config = {
    channelAccessToken: process.env.channelAccessToken,
    channelSecret: process.env.channelSecret,
};

// Initialize express
const app = express();

// Use Line middleware to verify Line requests
app.use(middleware(config));

// Parse JSON request body
app.use(bodyParser.json());
const home = (req, res) => {
    res.send("Hello, World!");
};
app.post("/home", home);
// Use the controller to handle webhook
const lineController = require("./controllers/line");
app.post("/webhook", lineController.handleWebhook);

cron.schedule("*/3 * * * *", getService.fetchOTP);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
