# DSA Pattern Coach — AI-First Gemini/Vercel App

A public, Vercel-ready DSA interview assistant for Rex.

## What it does

- Frontend runs in the browser.
- `/api/analyze` runs as a Vercel Serverless Function.
- The app asks Gemini first for a tailored answer.
- If Gemini is missing, invalid, or times out, the browser uses the embedded Instant Engine fallback.
- Every result is clearly labeled:
  - `🧠 Source: AI Smart Solver`
  - `⚡ Source: Instant Engine Fallback`

## Deploy with one click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Rexdomine/dsa-pattern-coach&env=GEMINI_API_KEY,GEMINI_MODEL,GEMINI_BASE_URL&envDescription=Gemini%20settings%20for%20AI%20Smart%20Solver&envLink=https://aistudio.google.com/app/apikey)

## Required Vercel environment variables

Set these in Vercel Project Settings → Environment Variables:

```bash
GEMINI_API_KEY=your_google_ai_studio_key
GEMINI_MODEL=gemini-1.5-flash
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
```

Get a Gemini key:

```text
https://aistudio.google.com/app/apikey
```

## Local run

For static/frontend-only testing:

```bash
python3 -m http.server 8787
```

For Vercel API testing:

```bash
npm i -g vercel
vercel dev
```

Create `.env.local` locally if using `vercel dev`:

```bash
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-1.5-flash
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
```

## Deployment

```bash
vercel --prod
```

## Files

- `index.html` — UI shell.
- `style.css` — dark interview dashboard design.
- `app.js` — AI-first frontend flow plus instant fallback engine.
- `api/analyze.js` — Gemini serverless backend brain.
- `.env.example` — safe environment template.

## Security

Do not commit real API keys. Use Vercel environment variables.
