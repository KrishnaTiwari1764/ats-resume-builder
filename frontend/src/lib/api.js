import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050";

const client = axios.create({ baseURL: API_BASE });

function unwrapError(err) {
  const message =
    err?.response?.data?.error ||
    (err?.code === "ERR_NETWORK"
      ? "Can't reach the backend server. Make sure it's running on port 5050."
      : err?.message) ||
    "Something went wrong.";
  return new Error(message);
}

export async function parseResumeFile(file) {
  const formData = new FormData();
  formData.append("resume", file);
  try {
    const { data } = await client.post("/api/resume/parse-file", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.text;
  } catch (err) {
    throw unwrapError(err);
  }
}

export async function tailorResume(resumeText, jobDescription) {
  try {
    const { data } = await client.post("/api/resume/tailor", {
      resumeText,
      jobDescription,
    });
    return data;
  } catch (err) {
    throw unwrapError(err);
  }
}
