// EcoDomus — chatbot serverless (Netlify Function)
// Si attiva impostando la variabile d'ambiente ANTHROPIC_API_KEY nel pannello Netlify.
// Finché la chiave non è impostata, risponde 503 e il sito usa il fallback locale.
//
// Protezioni anti-abuso incluse:
// - limite di richieste per IP (finestra scorrevole, per istanza)
// - limite lunghezza messaggi e cronologia
// - max_tokens contenuto -> costo per risposta molto basso (modello Haiku)

const SYSTEM = `Sei l'assistente virtuale di EcoDomus — Sviluppo Immobiliare, azienda italiana
(Lombardia) di edilizia sostenibile, project management (PMO), investimento immobiliare e
soluzioni di intelligenza artificiale per l'edilizia. Rispondi in italiano (o in arabo se
l'utente scrive in arabo), in modo cordiale, breve e concreto (max 4-5 frasi). Aiuti i
visitatori a capire i servizi, li orienti e raccogli il loro interesse. Non inventare prezzi
precisi: per i preventivi invita a scrivere su WhatsApp al 351 626 3082 o dalla pagina
Contatti. Se chiedono del risparmio energetico, suggerisci il Calcolatore presente sul sito.
Il progetto in vendita ora è Corte Vittoria a Massalengo (LO): appartamenti al grezzo da
39.800 euro o chiavi in mano in classe A, mutuabili, vendita diretta senza intermediari.
Non promettere rendimenti finanziari garantiti e non dare consulenza legale o fiscale.`;

// --- rate limiting semplice per IP (memoria dell'istanza) ---
const WINDOW_MS = 10 * 60 * 1000; // 10 minuti
const MAX_REQ = 20;               // max richieste per IP nella finestra
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter(t => now - t < WINDOW_MS);
  if (arr.length >= MAX_REQ) { hits.set(ip, arr); return true; }
  arr.push(now); hits.set(ip, arr);
  if (hits.size > 5000) hits.clear(); // evita crescita illimitata
  return false;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return { statusCode: 503, body: JSON.stringify({ error: 'AI non configurata' }) };
  }
  const ip = (event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || 'unknown');
  if (limited(ip)) {
    return {
      statusCode: 429,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ reply: 'Hai fatto molte domande in poco tempo 🙂 Per continuare subito scrivici su WhatsApp al 351 626 3082.' }),
    };
  }
  let messages = [];
  try {
    const parsed = JSON.parse(event.body || '{}');
    messages = Array.isArray(parsed.messages) ? parsed.messages.slice(-10) : [];
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Bad request' }) };
  }
  messages = messages
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map(m => ({ role: m.role, content: m.content.slice(0, 1500) }));
  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return { statusCode: 400, body: JSON.stringify({ error: 'No user message' }) };
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
        max_tokens: 350,
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
