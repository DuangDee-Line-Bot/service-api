const express = require("express");
const fs = require("fs");
const app = express();
const randomstring = require("randomstring");
const cron = require("node-cron");
const localforage = require("localforage");

const port = 8070; // You can change the port as needed

const randomStr = randomstring.generate({
  length: 5, // Specify the desired length
  charset: "alphanumeric", // Choose the character set (alphabetic, numeric, or alphanumeric)
  capitalization: "uppercase", // Set capitalization (uppercase, lowercase, or mixed)
  readable: true, // Generate more human-readable strings
});
// function generateRandomNumberWithLetters(length) {
//   const numbers = "0123456789";
//   const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
//   const combinedChars = numbers + letters;

//   let randomString = "";
//   for (let i = 0; i < length; i++) {
//     const randomIndex = Math.floor(Math.random() * combinedChars.length);
//     randomString += combinedChars.charAt(randomIndex);
//   }

//   return randomString;
// }

// // Example usage:
// const randomString = generateRandomNumberWithLetters(5).toUpperCase();
// console.log(randomString);
function randomOTP() {
  const randomStr = randomstring.generate({
    length: 5,
    charset: "alphanumeric",
    capitalization: "uppercase",
    readable: true,
  });
  return randomStr;
}
// Middleware to parse JSON requests
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.get("/api/data", (req, res) => {
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Error reading data");
    } else {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    }
  });
});
cron.schedule("30 * * * *", () => {
  // Replace the following with your actual API endpoint
  const otp = randomOTP();
  localforage.setItem("OTP", otp);

  // fetch("https://api-line-bot.onrender.com/api/generateOTP")
  //   .then((response) => {
  //     if (response.ok) {
  //       console.log("API request successful");
  //     } else {
  //       console.error("API request failed:", response.statusText);
  //     }
  //   })
  //   .catch((error) => {
  //     console.error("API request error:", error);
  //   });
});
app.get("/api/generateOTP", (req, res) => {
  const localOTP = localforage.getItem("OTP");
  res.json({ OTP: localOTP });

  // Schedule the API endpoint to be re-executed every 1 minute
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
