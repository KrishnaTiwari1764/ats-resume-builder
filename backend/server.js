import "dotenv/config"; // must be the first import so env vars exist before other modules read them
import express from "express";
import cors from "cors";
import resumeRoutes from "./src/routes/resumeRoutes.js";

const app = express();
const PORT = process.env.PORT || 5050;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, hasApiKey: Boolean(process.env.GEMINI_API_KEY) });
});

app.use("/api/resume", resumeRoutes);

// Multer / generic error fallback
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error." });
});

app.listen(PORT, () => {
  console.log(`ATS Resume Builder API running on http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn(
      "⚠️  GEMINI_API_KEY is not set. Copy .env.example to .env and add your key."
    );
  }
});
