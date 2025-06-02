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
app.set("trust proxy", true);

// Routes
// Simple route to check if the server is running
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const getClientIP = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.headers["x-real-ip"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip
  );
};

// Endpoint to fetch user location based on IP address
app.get("/api/user-location", async (req, res) => {
  let clientIP = getClientIP(req);

  // Handle localhost/local IPs
  if (
    clientIP === "::1" ||
    clientIP === "127.0.0.1" ||
    clientIP?.startsWith("192.168.") ||
    clientIP?.startsWith("10.")
  ) {
    clientIP = "8.8.8.8"; // Test IP for development
  }
  try {
    const { data } = await axios.get(`${API_URI}/${clientIP}/json`);

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
