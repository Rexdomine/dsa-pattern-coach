function compactPrompt(problem) {
  return `Solve this DSA interview problem exactly, tailored to the prompt. Return JSON only.

Problem:
${problem}

JSON keys required:
title, pattern, confidence_note, opening_script, why_pattern, clarifying_questions,
brute_force, optimized_steps, code, line_by_line, tests, complexity, challenge_answers.

Rules:
- code must be complete Python, not a generic template.
- line_by_line must tell Rex what to say while writing each important line/block.
- tests must include expected outputs.
- challenge_answers must defend the chosen pattern and tradeoffs.
- keep wording concise and speakable in a live interview.`;
}

function parseJsonText(text) {
  const cleaned = String(text || '')
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '');
  return JSON.parse(cleaned);
}

async function callGemini(problem) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const baseUrl = (process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta').replace(/\/$/, '');

  if (!apiKey || apiKey.startsWith('PASTE_')) {
    return { _ai_error: 'Gemini API key is not configured on Vercel. Add GEMINI_API_KEY in Project Settings → Environment Variables, then redeploy.' };
  }

  const url = `${baseUrl}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: compactPrompt(problem) }] }],
      generationConfig: {
        temperature: 0.15,
        maxOutputTokens: 2200,
        responseMimeType: 'application/json'
      }
    })
  });

  const raw = await response.text();
  if (!response.ok) {
    return { _ai_error: `Gemini HTTP ${response.status}: ${raw.slice(0, 500)}` };
  }

  const data = JSON.parse(raw);
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    return { _ai_error: 'Gemini returned no text content.' };
  }

  const parsed = parseJsonText(text);
  parsed.model_used = model;
  parsed.provider_used = 'gemini';
  return parsed;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const problem = String(req.body?.problem || '').trim();
  if (!problem) return res.status(400).json({ error: 'problem is required' });

  try {
    const ai = await callGemini(problem);
    if (ai && !ai._ai_error) {
      return res.status(200).json({ ...ai, mode: 'ai' });
    }
    return res.status(200).json({ mode: 'fallback', ai_error: ai?._ai_error || 'AI did not return a usable answer.' });
  } catch (error) {
    return res.status(200).json({ mode: 'fallback', ai_error: `AI request failed: ${error.message}` });
  }
}
