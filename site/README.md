# Sito Omar Edile — Immobiliare & Costruzioni

Sito statico (HTML/CSS/JS, nessun build step) per **omarristrutturazionimilano.it**.
Veloce, ottimizzato per Google, senza vincoli di piattaforma.

## Struttura

```
site/
├─ index.html                      Home
├─ chi-siamo.html
├─ servizi.html
├─ ristrutturazioni-sostenibili.html
├─ intelligenza-artificiale.html
├─ sviluppo-immobiliare.html       Corte Vittoria (pagina di punta)
├─ lavori.html
├─ blog.html
├─ contatti.html
├─ 404.html · robots.txt · sitemap.xml
└─ assets/  (css/ · js/ · img/)
```

## Vedere il sito in locale

Apri semplicemente `index.html` nel browser, oppure con un mini server:

```bash
cd site
python3 -m http.server 8080
# poi apri http://localhost:8080
```

## Pubblicare gratis (consigliato: Netlify)

1. Vai su https://app.netlify.com → **Add new site → Import from GitHub**.
2. Seleziona il repository. Il file `netlify.toml` è già configurato (`publish = "site"`).
3. Deploy. Otterrai un indirizzo `*.netlify.app`.
4. **Dominio**: Domain settings → Add custom domain → `omarristrutturazionimilano.it`, poi
   sposta i DNS come indicato (record A/CNAME). SSL gratuito automatico.

In alternativa: **Vercel** (stesso flusso) o **GitHub Pages** (Settings → Pages → cartella `/site`).

## Modulo contatti (Netlify Forms — attivo)

I form usano già **Netlify Forms** (`data-netlify="true"` + campo nascosto `form-name`
+ honeypot `bot-field`). Dopo l'invio l'utente viene reindirizzato a `grazie.html`
(o `shukran.html` per l'arabo). Le richieste vengono salvate nel pannello Netlify.

**Unico passaggio manuale (nel pannello Netlify):** per ricevere le richieste via
email, vai su **Forms → Form notifications → Add notification → Email notification**
e inserisci l'indirizzo. I moduli presenti: `richiesta`, `contatti`, `corte-vittoria`,
`corte-vittoria-ar`.

## Modificare i contenuti

- **Testi**: direttamente negli `.html`.
- **Immagini**: sostituisci i file in `assets/img/` mantenendo lo stesso nome.
- **Unità/prezzi Corte Vittoria**: tabella in `sviluppo-immobiliare.html` (sezione "Le unità").
- **Colori/brand**: variabili in cima a `assets/css/style.css` (`--brand`, `--terra`, ...).

## Dati progetto

- Sede: Via Sant'Angelo 4, Cerro al Lambro (MI/LO) · P.IVA 12765450965
- Corte Vittoria: Piazza della Vittoria 1, Massalengo (LO)
- WhatsApp: +39 351 626 3082 · info@omarristrutturazionimilano.it
