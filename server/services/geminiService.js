const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export const inferIssueMeta = async (text) => {
  if (!process.env.GEMINI_API_KEY || !text) {
    return { category: 'other', severity: 'medium', summary: '' };
  }

  const prompt = `Classify this civic issue report into one of: pothole, garbage, streetlight, water, drainage, other. Also infer severity low/medium/high and return compact JSON with keys category, severity, summary. Text: ${text}`;

  const response = await fetch(`${endpoint}?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  if (!response.ok) {
    return { category: 'other', severity: 'medium', summary: '' };
  }

  const data = await response.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  try {
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return {
      category: parsed.category || 'other',
      severity: parsed.severity || 'medium',
      summary: parsed.summary || ''
    };
  } catch {
    return { category: 'other', severity: 'medium', summary: raw };
  }
};
