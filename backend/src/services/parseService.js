import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";

/**
 * Extracts plain text from an uploaded resume file buffer.
 * Supports PDF, DOCX, and plain text files.
 */
export async function extractTextFromFile(buffer, mimetype, originalname = "") {
  const ext = originalname.split(".").pop()?.toLowerCase();

  try {
    if (mimetype === "application/pdf" || ext === "pdf") {
      const data = await pdfParse(buffer);
      return cleanText(data.text);
    }

    if (
      mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      ext === "docx"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return cleanText(result.value);
    }

    if (mimetype === "text/plain" || ext === "txt") {
      return cleanText(buffer.toString("utf-8"));
    }

    if (ext === "doc") {
      throw new Error(
        "Legacy .doc files aren't supported. Please upload a .docx or .pdf instead."
      );
    }

    throw new Error(
      "Unsupported file type. Please upload a PDF, DOCX, or TXT resume."
    );
  } catch (err) {
    if (err.message?.includes("Unsupported") || err.message?.includes("Legacy")) {
      throw err;
    }
    throw new Error(
      "Couldn't read that file. It may be corrupted, scanned as an image, or password protected."
    );
  }
}

function cleanText(text) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}
