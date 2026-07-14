-- MigliorSpesa — schema iniziale, versione Supabase.
--
-- Adattato dalla progettazione generica (vedi la cronologia del progetto):
-- qui l'identità utente usa auth.users di Supabase invece di una tabella
-- fatta in casa, ogni tabella ha Row Level Security perché l'app la
-- interroga direttamente da client con supabase-js (chiave anon, pubblica),
-- e ogni tabella ha i GRANT espliciti richiesti dalla versione corrente:
-- le tabelle nuove non sono più esposte automaticamente alle API
-- (anon/authenticated) senza un GRANT esplicito, RLS da sola non basta.

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================
-- Anagrafica catene e negozi
-- ============================================================

CREATE TABLE catena (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome      TEXT NOT NULL UNIQUE,
  iniziali  TEXT NOT NULL,
  colore    TEXT NOT NULL,                 -- hex del brand, es. '#0B7A3B'
  creato_il TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE catena IS
  'Il brand/retailer (Esselunga, Conad, ...). Branding statico: resta anche client-side nella app come oggi, questa tabella è la fonte di verità lato server.';

CREATE TABLE zona (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome          TEXT NOT NULL,             -- es. 'Nord-Ovest', 'Lombardia'
  cap_prefissi  TEXT[] NOT NULL DEFAULT '{}'
);

COMMENT ON TABLE zona IS
  'Raggruppamento geografico usato SOLO dai volantini (che valgono "per zona", non per singolo negozio).';

CREATE TABLE negozio (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  catena_id  UUID NOT NULL REFERENCES catena(id) ON DELETE CASCADE,
  zona_id    UUID REFERENCES zona(id),
  nome       TEXT NOT NULL,                -- es. 'Esselunga Milano Navigli'
  indirizzo  TEXT NOT NULL,
  comune     TEXT NOT NULL,
  cap        TEXT NOT NULL,
  lat        DOUBLE PRECISION NOT NULL,
  lon        DOUBLE PRECISION NOT NULL,
  attivo     BOOLEAN NOT NULL DEFAULT TRUE,
  creato_il  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE negozio IS
  'Punto vendita fisico. Sostituisce il distanceKm finto hardcoded per catena nella app: la distanza si calcola dalla posizione utente vera.';

CREATE INDEX idx_negozio_catena ON negozio(catena_id);
CREATE INDEX idx_negozio_zona   ON negozio(zona_id);

-- ============================================================
-- Prodotti
-- ============================================================

CREATE TABLE categoria (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome           TEXT NOT NULL UNIQUE,
  colore_sfondo  TEXT NOT NULL,
  colore_testo   TEXT NOT NULL
);

COMMENT ON TABLE categoria IS 'Corrisponde a CAT_COLORS in app/src/theme.ts.';

CREATE TYPE unita_misura AS ENUM ('g', 'kg', 'ml', 'l', 'pz');

CREATE TABLE prodotto (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ean            TEXT UNIQUE,              -- barcode; NULL se il prodotto non ne ha uno standard
  nome           TEXT NOT NULL,
  marca          TEXT,
  quantita       NUMERIC(10,3) NOT NULL,   -- es. 500, 1, 0.5
  unita_misura   unita_misura NOT NULL,
  categoria_id   UUID NOT NULL REFERENCES categoria(id),
  iniziali       TEXT NOT NULL,            -- per il tile "PA" nell'app
  creato_il      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE prodotto IS
  'Identità canonica del prodotto, indipendente dalla catena. L''EAN fa capire che lo stesso prodotto da due catene è una riga sola. quantita+unita_misura normalizzano il prezzo per confronti onesti tra formati diversi.';

CREATE INDEX idx_prodotto_categoria ON prodotto(categoria_id);
CREATE INDEX idx_prodotto_nome_trgm ON prodotto USING gin (nome gin_trgm_ops);

CREATE TABLE catena_prodotto_sku (
  catena_id    UUID NOT NULL REFERENCES catena(id) ON DELETE CASCADE,
  prodotto_id  UUID NOT NULL REFERENCES prodotto(id) ON DELETE CASCADE,
  sku_catena   TEXT NOT NULL,
  PRIMARY KEY (catena_id, prodotto_id)
);

-- ============================================================
-- Prezzi — storico append-only
-- ============================================================

CREATE TYPE fonte_prezzo AS ENUM ('scraping', 'volantino', 'crowdsourcing', 'feed_partner');

CREATE TABLE prezzo (
  id                 BIGSERIAL PRIMARY KEY,
  negozio_id         UUID NOT NULL REFERENCES negozio(id) ON DELETE CASCADE,
  prodotto_id        UUID NOT NULL REFERENCES prodotto(id) ON DELETE CASCADE,
  prezzo             NUMERIC(10,2) NOT NULL CHECK (prezzo > 0),
  valuta             CHAR(3) NOT NULL DEFAULT 'EUR',
  rilevato_il        TIMESTAMPTZ NOT NULL DEFAULT now(),
  fonte              fonte_prezzo NOT NULL,
  riferimento_fonte  TEXT
);

COMMENT ON TABLE prezzo IS
  'Serie storica, MAI aggiornata in place: ogni rilevazione è una riga nuova. Alimenta sia "prezzo adesso" (ultima riga) sia lo storico prezzi (feature premium).';

CREATE INDEX idx_prezzo_negozio_prodotto_tempo
  ON prezzo(negozio_id, prodotto_id, rilevato_il DESC);

CREATE VIEW prezzo_corrente AS
SELECT DISTINCT ON (negozio_id, prodotto_id)
  negozio_id, prodotto_id, prezzo, rilevato_il, fonte
FROM prezzo
ORDER BY negozio_id, prodotto_id, rilevato_il DESC;

-- ============================================================
-- Promozioni da volantino
-- ============================================================

CREATE TABLE promozione (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  catena_id      UUID NOT NULL REFERENCES catena(id) ON DELETE CASCADE,
  zona_id        UUID REFERENCES zona(id),   -- NULL = valida a livello nazionale
  prodotto_id    UUID NOT NULL REFERENCES prodotto(id) ON DELETE CASCADE,
  prezzo_promo   NUMERIC(10,2) NOT NULL CHECK (prezzo_promo > 0),
  valido_dal     DATE NOT NULL,
  valido_al      DATE NOT NULL CHECK (valido_al >= valido_dal),
  url_volantino  TEXT,
  creato_il      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE promozione IS
  'Separata da prezzo perché un volantino vale per zona e per una finestra di date, non per un singolo negozio in un istante.';

CREATE INDEX idx_promozione_prodotto_validita
  ON promozione(prodotto_id, valido_dal, valido_al);

CREATE VIEW prezzo_effettivo AS
SELECT
  pc.negozio_id,
  pc.prodotto_id,
  LEAST(pc.prezzo, COALESCE(pr.prezzo_promo, pc.prezzo)) AS prezzo_finale,
  (pr.id IS NOT NULL AND pr.prezzo_promo < pc.prezzo)    AS in_promozione
FROM prezzo_corrente pc
JOIN negozio n ON n.id = pc.negozio_id
LEFT JOIN promozione pr
  ON pr.prodotto_id = pc.prodotto_id
  AND pr.catena_id = n.catena_id
  AND (pr.zona_id IS NULL OR pr.zona_id = n.zona_id)
  AND CURRENT_DATE BETWEEN pr.valido_dal AND pr.valido_al;

-- ============================================================
-- Profilo utente — collegato a auth.users (Supabase Auth),
-- non una tabella utenti fatta in casa.
-- ============================================================

CREATE TABLE profilo (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  creato_il  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE profilo IS
  'Una riga per utente autenticato. auth.users gestisce già identità/credenziali: qui vanno solo i dati applicativi legati all''utente.';

-- Crea automaticamente il profilo quando qualcuno si registra.
CREATE FUNCTION public.gestisci_nuovo_utente()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profilo (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.gestisci_nuovo_utente();

-- ============================================================
-- Crowdsourcing — intake separato, non ancora dato "ufficiale"
-- ============================================================

CREATE TYPE stato_segnalazione AS ENUM ('in_attesa', 'approvato', 'rifiutato');

CREATE TABLE segnalazione_prezzo (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  negozio_id          UUID NOT NULL REFERENCES negozio(id) ON DELETE CASCADE,
  prodotto_id         UUID NOT NULL REFERENCES prodotto(id) ON DELETE CASCADE,
  prezzo              NUMERIC(10,2) NOT NULL CHECK (prezzo > 0),
  utente_id           UUID NOT NULL REFERENCES profilo(id) ON DELETE CASCADE,
  inviato_il          TIMESTAMPTZ NOT NULL DEFAULT now(),
  foto_scontrino_url  TEXT,
  stato               stato_segnalazione NOT NULL DEFAULT 'in_attesa',
  conferme            INTEGER NOT NULL DEFAULT 0 CHECK (conferme >= 0)
);

COMMENT ON TABLE segnalazione_prezzo IS
  'Un utente che segnala un prezzo non è automaticamente verità: resta qui finché non viene moderata/corroborata e promossa a una riga in prezzo con fonte=crowdsourcing.';

CREATE INDEX idx_segnalazione_stato ON segnalazione_prezzo(stato);

-- ============================================================
-- Row Level Security + GRANT.
--
-- Catalogo (catena/negozio/categoria/prodotto/prezzo/promozione): lettura
-- pubblica per chiunque, anche senza login — è il confronto prezzi che
-- l'app mostra in home. Le scritture (scraping/volantino/feed) le fanno
-- solo i job lato server con la service_role key, che salta RLS per
-- definizione: non serve una policy di INSERT qui.
-- ============================================================

ALTER TABLE catena              ENABLE ROW LEVEL SECURITY;
ALTER TABLE zona                ENABLE ROW LEVEL SECURITY;
ALTER TABLE negozio              ENABLE ROW LEVEL SECURITY;
ALTER TABLE categoria            ENABLE ROW LEVEL SECURITY;
ALTER TABLE prodotto             ENABLE ROW LEVEL SECURITY;
ALTER TABLE catena_prodotto_sku  ENABLE ROW LEVEL SECURITY;
ALTER TABLE prezzo               ENABLE ROW LEVEL SECURITY;
ALTER TABLE promozione           ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lettura pubblica" ON catena             FOR SELECT USING (true);
CREATE POLICY "lettura pubblica" ON zona               FOR SELECT USING (true);
CREATE POLICY "lettura pubblica" ON negozio             FOR SELECT USING (true);
CREATE POLICY "lettura pubblica" ON categoria           FOR SELECT USING (true);
CREATE POLICY "lettura pubblica" ON prodotto            FOR SELECT USING (true);
CREATE POLICY "lettura pubblica" ON catena_prodotto_sku FOR SELECT USING (true);
CREATE POLICY "lettura pubblica" ON prezzo              FOR SELECT USING (true);
CREATE POLICY "lettura pubblica" ON promozione          FOR SELECT USING (true);

GRANT SELECT ON
  catena, zona, negozio, categoria, prodotto, catena_prodotto_sku, prezzo, promozione,
  prezzo_corrente, prezzo_effettivo
TO anon, authenticated;

-- Profilo: ognuno vede/crea/aggiorna solo il proprio.
ALTER TABLE profilo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "utente legge il proprio profilo"
  ON profilo FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "utente aggiorna il proprio profilo"
  ON profilo FOR UPDATE TO authenticated USING (auth.uid() = id);

GRANT SELECT, UPDATE ON profilo TO authenticated;

-- Segnalazioni: un utente autenticato crea e legge solo le proprie; la
-- moderazione (cambio di stato) la fa un job/admin con la service_role key.
ALTER TABLE segnalazione_prezzo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "utente crea le proprie segnalazioni"
  ON segnalazione_prezzo FOR INSERT TO authenticated WITH CHECK (auth.uid() = utente_id);
CREATE POLICY "utente legge le proprie segnalazioni"
  ON segnalazione_prezzo FOR SELECT TO authenticated USING (auth.uid() = utente_id);

GRANT SELECT, INSERT ON segnalazione_prezzo TO authenticated;

-- ============================================================
-- Storage — foto degli scontrini per il crowdsourcing.
-- Il bucket "scontrini" è dichiarato in supabase/config.toml; qui solo
-- le policy di accesso. Convenzione: ogni file vive sotto <utente_id>/...,
-- così la policy può verificare la proprietà dal path senza una tabella
-- di appoggio.
-- ============================================================

CREATE POLICY "utente carica il proprio scontrino"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'scontrini' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "utente legge i propri scontrini"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'scontrini' AND (storage.foldername(name))[1] = auth.uid()::text);
