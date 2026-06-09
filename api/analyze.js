async function callHermesBrain(problem) {
  const brainUrl = (process.env.HERMES_BRAIN_URL || '').replace(/\/$/, '');
  const brainToken = process.env.HERMES_BRAIN_TOKEN || '';

  if (!brainUrl) {
    return { _ai_error: 'HERMES_BRAIN_URL is not configured on Vercel.' };
  }
  if (!brainToken) {
    return { _ai_error: 'HERMES_BRAIN_TOKEN is not configured on Vercel.' };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 70000);
  try {
    const response = await fetch(`${brainUrl}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-DSA-Brain-Token': brainToken
      },
      body: JSON.stringify({ problem }),
      signal: controller.signal
    });
    const raw = await response.text();
    if (!response.ok) {
      return { _ai_error: `Hermes brain HTTP ${response.status}: ${raw.slice(0, 500)}` };
    }
    return JSON.parse(raw);
  } finally {
    clearTimeout(timeout);
  }
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
    const ai = await callHermesBrain(problem);
    if (ai && ai.mode === 'ai' && ai.code && !ai._ai_error) {
      return res.status(200).json({ ...ai, mode: 'ai' });
    }
    return res.status(200).json({ mode: 'fallback', ai_error: ai?._ai_error || ai?.ai_error || 'Hermes/Groot brain did not return a usable answer.' });
  } catch (error) {
    return res.status(200).json({ mode: 'fallback', ai_error: `Hermes/Groot brain request failed: ${error.message}` });
  }
}
