// EcoDomus — chatbot serverless (Netlify Function)
// Si attiva impostando la variabile d'ambiente ANTHROPIC_API_KEY nel pannello Netlify.
// Finché la chiave non è impostata, risponde 503 e il sito usa il fallback locale.

const SYSTEM = `Sei l'assistente virtuale di EcoDomus — Sviluppo Immobiliare, azienda italiana
(Lombardia) di edilizia sostenibile, project management (PMO), investimento immobiliare e
soluzioni di intelligenza artificiale per l'edilizia. Rispondi in italiano, in modo cordiale,
breve e concreto (max 4-5 frasi). Aiuti i visitatori a capire i servizi, li orienti e raccogli
il loro interesse. Non inventare prezzi precisi: per i preventivi invita a scrivere su WhatsApp
al 351 626 3082 o dalla pagina Contatti. Se chiedono del risparmio energetico, suggerisci il
Calcolatore presente sul sito. Non promettere rendimenti finanziari garantiti.`;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    // Non configurato: il frontend userà la risposta di fallback.
    return { statusCode: 503, body: JSON.stringify({ error: 'AI non configurata' }) };
  }
  let messages = [];
  try {
    const parsed = JSON.parse(event.body || '{}');
    messages = Array.isArray(parsed.messages) ? parsed.messages.slice(-12) : [];
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Bad request' }) };
  }
  // sanitizza
  messages = messages
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map(m => ({ role: m.role, content: m.content.slice(0, 2000) }));
  if (!messages.length) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No messages' }) };
  }
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: SYSTEM,
        messages,
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      return { statusCode: 502, body: JSON.stringify({ error: 'Upstream error', detail: t.slice(0, 300) }) };
    }
    const data = await res.json();
    const reply = (data.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n').trim();
    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ reply: reply || 'Come posso aiutarti?' }),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) };
  }
};
