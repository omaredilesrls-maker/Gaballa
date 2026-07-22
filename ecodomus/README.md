# EcoDomus — Sviluppo Immobiliare

Sito statico del brand **EcoDomus** (edilizia sostenibile · PMO · investimento · IA).
Convive nello stesso repository con il sito Omar Edile (`site/`).

## Deploy su Netlify (progetto dedicato)

1. Netlify → **Add new project → Import from GitHub** → questo repository.
2. **Base directory: `ecodomus`** ← fondamentale, altrimenti viene pubblicato il sito sbagliato.
   (Publish directory: `.` · Functions directory: `functions` — già nel `netlify.toml` locale.)
3. Deploy. I deploy successivi partono a ogni push su `main`.

## Attivare l'IA del chatbot

Il widget chat funziona subito con risposte di base. Per l'IA completa:

1. Crea una chiave su console.anthropic.com (bastano ~$5 di credito).
2. Netlify → progetto EcoDomus → **Environment variables** → `ANTHROPIC_API_KEY` = la chiave.
3. **Trigger deploy** per caricarla.

Protezioni già incluse: rate limit 20 richieste/10 min per IP, messaggi troncati,
`max_tokens` 350, modello economico (Haiku).

## Struttura

```
ecodomus/
├─ index.html · servizi.html · progetti.html · chi-siamo.html
├─ calcolatore.html · blog.html · contatti.html · 404.html · grazie.html
├─ assets/ (css · js · img con il kit logo)
├─ functions/chat.js   (chatbot serverless)
└─ netlify.toml · sitemap.xml · robots.txt
```

## Contatti progetto

WhatsApp +39 351 626 3082 · omaredilesrls@gmail.com
