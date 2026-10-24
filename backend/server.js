require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const startReminders = require("./utils/reminders");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  startReminders();
  app.listen(PORT, () => console.log(`Eventora API on http://localhost:${PORT}`));
});
