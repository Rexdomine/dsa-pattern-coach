# DSA Pattern Coach — AI-First Hermes/Groot Brain

A public, Vercel-ready DSA interview assistant for Rex.

## What it does

- Frontend runs on Vercel.
- `/api/analyze` runs as a Vercel Serverless Function.
- Vercel forwards the question to the Hermes/Groot brain running on the VPS.
- Hermes/Groot returns a tailored DSA interview solution.
- If the brain is unavailable or times out, the browser uses the embedded Instant Engine fallback.
- Every result is clearly labeled:
  - `🧠 Source: AI Smart Solver`
  - `⚡ Source: Instant Engine Fallback`

## Required Vercel environment variables

Set these in Vercel Project Settings → Environment Variables:

```bash
HERMES_BRAIN_URL=https://your-hermes-brain-url.example.com
HERMES_BRAIN_TOKEN=your_shared_secret
```

## Local frontend run

```bash
python3 -m http.server 8787
```

## Deployment

```bash
vercel --prod
```

## Files

- `index.html` — UI shell.
- `style.css` — dark interview dashboard design.
- `app.js` — AI-first frontend flow plus instant fallback engine.
- `api/analyze.js` — Vercel function that calls the Hermes/Groot brain.
- `.env.example` — safe environment template.

## Security

Do not commit real brain tokens. Use Vercel environment variables.
