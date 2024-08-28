const express = require("express");
const fs = require("fs");
const app = express();
const port = 8080; // You can change the port as needed

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
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
