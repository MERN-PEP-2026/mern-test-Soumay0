const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env
dotenv.config();

const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();

const app = express();

// --- Global Middleware ---
// Allow cross-origin requests (needed when React frontend calls this API)
app.use(cors());
// Parse incoming JSON bodies
app.use(express.json());
// Parse URL-encoded form data
app.use(express.urlencoded({ extended: false }));

// --- Routes (will be added step by step) ---
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
