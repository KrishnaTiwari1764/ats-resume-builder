# Signal — AI ATS Resume Builder

Paste your resume and a job description; get back a resume that's honestly
rewritten to match that job's language — the terms an ATS is actually
scanning for, with your real experience re-prioritized and re-worded around
it. Nothing is invented: the AI is instructed to only rephrase and
re-emphasize what's true, and to tell you honestly what's still missing
rather than fabricate it.

```
ats-resume-builder/
├── backend/     Node.js + Express API (talks to Gemini, parses uploaded resumes)
└── frontend/    React + Vite + Tailwind UI
```

## How it works

1. **You provide your resume** — paste it in, or upload a PDF/DOCX/TXT (the
   backend extracts the text).
2. **You paste a job description.**
3. **The backend calls Gemini** (`POST /api/resume/tailor`) with both, using
   a strict JSON response schema so the response comes back as clean,
   reliable structured data — not free text that has to be guessed at.
4. **You get back:** a rewritten resume, an ATS match score (0–100), which
   job-description keywords you already match, which ones you're missing,
   and honest recommendations for closing real gaps.
5. Everything on the results screen is **editable** before you **download it
   as a real, text-based PDF** (not a screenshot/image — ATS software needs
   to be able to read the actual text).

---

## Prerequisites

- **Node.js 18+** and npm — check with `node -v`
- A **Gemini API key** — get one free at
  [aistudio.google.com/apikey](https://aistudio.google.com/apikey) (sign in
  with any Google account, no credit card required)

  > **Note:** this is a *developer* API key from Google AI Studio — it's
  > separate from a Google AI Pro/Ultra consumer subscription (the one for
  > the Gemini app). A Pro/Ultra subscription doesn't automatically grant
  > API credits. The good news is the Gemini API has a genuinely usable
  > **free tier** on its own (roughly 250 requests/day with just an API
  > key), so you likely won't need to pay anything to use this project.

---

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `backend/.env` and paste in your key:

```
GEMINI_API_KEY=your-real-gemini-key-here
```

Start it:

```bash
npm start
```

You should see:

```
ATS Resume Builder API running on http://localhost:5050
```

Leave this terminal running. Verify it's healthy by visiting
`http://localhost:5050/api/health` in a browser — you should see
`{"ok":true,"hasApiKey":true}`.

## 2. Frontend setup

Open a **second terminal**:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Vite will print a local URL, typically `http://localhost:5173`. Open that in
your browser — that's the app.

*(The frontend's `.env` just points it at the backend URL; the default
`http://localhost:5050` already matches the backend's default port, so you
usually won't need to change anything.)*

---

## Using it

1. Click **"Tailor my resume"** on the landing page.
2. **Step 1** — paste your resume text, or drag a PDF/DOCX/TXT file in.
3. **Step 2** — paste the full job description you're applying to.
4. Click **"Tailor my resume"** and wait a few seconds while Gemini analyzes
   both documents.
5. On the results screen: check your **match score**, review **matched vs.
   missing keywords**, edit any text directly (name, summary, skills,
   bullet points — just click and type), then click **"Download PDF."**

---

## Deploying it for real use

Right now both pieces are configured for local development. To put this
online:

- **Backend**: deploy `backend/` to any Node host (Render, Railway, Fly.io,
  a VPS, etc.). Set `GEMINI_API_KEY` and `CLIENT_ORIGIN` (your deployed
  frontend's URL) as environment variables there — don't put your API key
  in frontend code, it would be publicly visible.
- **Frontend**: run `npm run build` inside `frontend/` to produce a static
  `dist/` folder, and deploy that to Vercel, Netlify, Cloudflare Pages, or
  similar. Set `VITE_API_BASE_URL` to your deployed backend's URL.

## Troubleshooting

| Problem | Fix |
|---|---|
| "Can't reach the backend server" in the UI | Make sure `npm start` is running in `backend/` on port 5050 |
| `403` / `PERMISSION_DENIED` when tailoring | Your `GEMINI_API_KEY` in `backend/.env` is missing or wrong |
| `429` / `RESOURCE_EXHAUSTED` | You've hit the free-tier rate limit (requests per minute/day) — wait a bit, or link a billing account in AI Studio for higher limits |
| "model not found" type error | Google occasionally renames/retires models — check `GEMINI_MODEL` in `backend/.env` against the current list at [ai.google.dev/gemini-api/docs/models](https://ai.google.dev/gemini-api/docs/models) |
| Upload fails on a resume file | Only PDF, DOCX, and TXT are supported (max 8MB); scanned/image-only PDFs have no extractable text — paste the text manually instead |
| Port already in use | Change `PORT` in `backend/.env`, or stop whatever's using 5050/5173 |

## Tech stack

- **Backend**: Node.js, Express, `@google/genai`, `multer` (uploads),
  `pdf-parse` + `mammoth` (resume text extraction)
- **Frontend**: React 19, Vite, Tailwind CSS, `@react-pdf/renderer`
  (real, text-based PDF generation), Lucide icons
- **AI**: Gemini, called with a JSON response schema so output is reliable
  structured data rather than parsed free text
