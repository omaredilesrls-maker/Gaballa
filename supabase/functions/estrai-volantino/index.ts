// Edge Function: estrae le offerte (prodotto + prezzo) da un volantino PDF
// usando Claude. Solo gli amministratori possono invocarla; la chiave
// ANTHROPIC_API_KEY vive nei secrets del progetto, mai nel client.
//
// Input:  { "path": "volantini-pdf/<file>.pdf" }  (file nel bucket "immagini")
// Output: { "offerte": [{ nome, marca, quantita, unita, prezzo, categoria }] }

import Anthropic from "npm:@anthropic-ai/sdk";
import { createClient } from "npm:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

const CATEGORIE = [
  "Dispensa",
  "Latticini e Uova",
  "Panetteria",
  "Bevande",
  "Frutta e Verdura",
  "Carne e Pesce",
  "Cura Casa",
];

// Structured output: la risposta è garantita conforme a questo schema.
const SCHEMA = {
  type: "object",
  properties: {
    offerte: {
      type: "array",
      items: {
        type: "object",
        properties: {
          nome: { type: "string", description: "Nome del prodotto, senza la marca" },
          marca: { type: "string", description: "Marca; stringa vuota se non indicata" },
          quantita: { type: "number", description: "Quantità numerica della confezione" },
          unita: { type: "string", enum: ["g", "kg", "ml", "l", "pz"] },
          prezzo: { type: "number", description: "Prezzo finale in euro della confezione" },
          categoria: { type: "string", enum: CATEGORIE },
        },
        required: ["nome", "marca", "quantita", "unita", "prezzo", "categoria"],
        additionalProperties: false,
      },
    },
  },
  required: ["offerte"],
  additionalProperties: false,
} as const;

const PROMPT = `Questo è il volantino di un supermercato italiano. Estrai TUTTE le offerte di prodotti che hanno un prezzo chiaramente leggibile.

Regole:
- "prezzo" è il prezzo finale in euro della confezione indicata (quello scontato, se c'è uno sconto).
- "quantita" + "unita" descrivono la confezione (es. 500 g, 1 l, 6 pz). Per prodotti sfusi venduti al chilo usa quantita 1 e unita "kg" col prezzo al kg.
- Per confezioni multiple (es. 6x1,5L) somma la quantità totale (9 l).
- Salta le offerte senza prezzo leggibile, i prodotti non alimentari/di consumo domestico e le offerte tipo "3x2" senza prezzo unitario.
- "categoria" è la più adatta tra quelle disponibili.
- Non inventare nulla: solo ciò che è scritto nel volantino.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    // Autorizzazione: la richiesta arriva col JWT dell'utente del pannello;
    // is_admin() decide col ruolo salvato in profilo.
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } },
    );
    const { data: isAdmin, error: errAdmin } = await supabase.rpc("is_admin");
    if (errAdmin || !isAdmin) {
      return json({ error: "Riservato agli amministratori." }, 403);
    }

    const { path } = await req.json();
    if (typeof path !== "string" || !path.startsWith("volantini-pdf/")) {
      return json({ error: "Percorso del PDF non valido." }, 400);
    }

    const { data: blob, error: errFile } = await supabase.storage
      .from("immagini")
      .download(path);
    if (errFile || !blob) return json({ error: "PDF non trovato." }, 404);
    if (blob.size > 25 * 1024 * 1024) {
      return json({ error: "PDF troppo grande (max 25 MB)." }, 400);
    }

    // Base64 senza a-capo, a blocchi per non saturare lo stack.
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let binary = "";
    const CHUNK = 0x8000;
    for (let i = 0; i < bytes.length; i += CHUNK) {
      binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
    }
    const b64 = btoa(binary);

    const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY")! });

    // Streaming per evitare timeout HTTP su PDF lunghi.
    const stream = anthropic.messages.stream({
      model: "claude-opus-4-8",
      max_tokens: 32000,
      thinking: { type: "adaptive" },
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema: SCHEMA },
      },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: { type: "base64", media_type: "application/pdf", data: b64 },
            },
            { type: "text", text: PROMPT },
          ],
        },
      ],
    });
    const message = await stream.finalMessage();

    if (message.stop_reason === "refusal") {
      return json({ error: "Analisi rifiutata dal modello." }, 422);
    }
    if (message.stop_reason === "max_tokens") {
      return json({ error: "Volantino troppo lungo: caricane una parte per volta." }, 422);
    }

    const text = message.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") {
      return json({ error: "Nessun risultato dal modello." }, 500);
    }
    return json(JSON.parse(text.text));
  } catch (e) {
    return json({ error: String((e as Error)?.message ?? e) }, 500);
  }
});
