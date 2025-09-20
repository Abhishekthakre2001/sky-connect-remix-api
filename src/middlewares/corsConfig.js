const cors = require("cors");

// CORS configuration
const corsOptions = {
  origin: "*", // 👈 allow all origins (or restrict to ["http://localhost:3000"])
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

module.exports = cors(corsOptions); // ✅ export middleware function
