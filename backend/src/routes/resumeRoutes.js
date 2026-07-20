import { Router } from "express";
import { upload } from "../middleware/upload.js";
import { extractTextFromFile } from "../services/parseService.js";
import { tailorResume } from "../services/aiService.js";

const router = Router();

// POST /api/resume/parse-file  (multipart/form-data, field name: "resume")
router.post("/parse-file", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    const text = await extractTextFromFile(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );

    if (!text || text.length < 20) {
      return res.status(422).json({
        error:
          "Couldn't find readable text in that file. If it's a scanned image, try pasting the text manually instead.",
      });
    }

    res.json({ text });
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to parse file." });
  }
});

// POST /api/resume/tailor  { resumeText, jobDescription }
router.post("/tailor", async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || resumeText.trim().length < 30) {
      return res
        .status(400)
        .json({ error: "Please provide your resume content (paste text or upload a file)." });
    }
    if (!jobDescription || jobDescription.trim().length < 30) {
      return res
        .status(400)
        .json({ error: "Please paste the job description you're targeting." });
    }

    const result = await tailorResume({ resumeText, jobDescription });
    res.json(result);
  } catch (err) {
    console.error("tailor error:", err);
    res.status(err.status || 500).json({
      error: err.message || "Something went wrong while tailoring the resume.",
    });
  }
});

export default router;
