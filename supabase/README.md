# Backend Supabase di MigliorSpesa

Schema, policy RLS e dati di prova per il confronto prezzi. L'app Expo in
`../app` interroga queste tabelle direttamente con supabase-js (chiave
publishable); senza configurazione resta in modalità demo coi dati locali.

## Collegare l'app a un progetto Supabase

1. **Crea il progetto** su [supabase.com/dashboard](https://supabase.com/dashboard)
   (o riusa uno esistente).

2. **Applica lo schema.** Con la CLI Supabase, da questa cartella (`supabase/`):

   ```sh
   supabase login
   supabase link --project-ref <PROJECT_REF>
   supabase db push
   ```

   In alternativa, incolla `migrations/20260713090000_init_schema.sql` nel
   SQL Editor del dashboard ed eseguilo.

3. **Carica l'anagrafica.** Esegui `seed.sql` nel SQL Editor (categorie e
   catene — dati statici, senza prezzi finti).

4. **(Opzionale) Dati di prova.** Per vedere il collegamento funzionare
   end-to-end senza avere ancora prezzi veri, esegui `demo_data.sql` nel SQL
   Editor: crea 6 negozi in zona Navigli, 10 prodotti e i relativi prezzi
   (gli stessi della modalità demo). Una sola esecuzione — non è idempotente.
   Si ripuliscono con `DELETE FROM prezzo WHERE riferimento_fonte = 'demo_data.sql';`.

5. **Configura l'app.** In `../app`:

   ```sh
   cp .env.example .env
   ```

   e incolla i valori da *Project Settings → API Keys* del dashboard:

   - `EXPO_PUBLIC_SUPABASE_URL` — il Project URL
   - `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — la chiave *publishable* (pubblica,
     va bene nel client; mai la service_role/secret)

6. **Avvia e verifica.** `npx expo start` in `../app`. Nella schermata
   **Profilo** l'ultima voce dice da dove arrivano i dati:
   *"Dati prezzi: Supabase (live)"* oppure *"Dati prezzi: demo locale"*.

## Come l'app usa lo schema

- Il catalogo arriva da `catena`, `negozio`, `categoria`, `prodotto` e dalla
  vista `prezzo_effettivo` (prezzo corrente con eventuale promo da volantino).
- Nel modello dell'app ogni catena mostra un prezzo per prodotto: il client
  prende il minimo tra i negozi della catena e tiene solo i prodotti prezzati
  in tutte le catene, così il confronto della lista spesa resta onesto.
- Le scritture (scraping, volantini, promozione delle segnalazioni) sono
  pensate per job server-side con la chiave service_role: il client ha solo
  lettura sul catalogo, più insert delle proprie `segnalazione_prezzo` e
  upload nel bucket `scontrini` per gli utenti autenticati.
