const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;
const API_URI = process.env.API_URI;

// Middleware
app.use(
  cors({
    origin: "*", // Allow all origins for simplicity; adjust as needed
    credentials: true, // Allow credentials if needed
  })
);
app.use(express.json());

// Routes
// Simple route to check if the server is running
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Endpoint to fetch user location based on IP address
app.get("/api/user-location", async (req, res) => {
  const ip = req.socket.remoteAddress;
  try {
    const { data } = await axios.get(`${API_URI}/${ip}/json`);

    res.status(200).json({
      ...data,
    });
  } catch (error) {
    console.error("Error fetching user location:", error);
    res.status(500).json({ error: "Failed to fetch user location" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
