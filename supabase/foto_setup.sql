-- Foto dei prodotti + foto dei volantini.
-- Eseguire UNA VOLTA nel SQL Editor, DOPO admin_setup.sql.
--
-- Se l'ultimo comando (CREATE POLICY su storage.objects) desse l'errore
-- "must be owner of table objects", crea la policy dal dashboard:
-- Storage > Policies > New policy sul bucket "immagini", operazione INSERT,
-- ruolo authenticated, con condizione:  public.is_admin()

-- Colonna per la foto del prodotto (URL pubblico nel bucket "immagini").
ALTER TABLE prodotto ADD COLUMN foto_url TEXT;

-- L'admin può aggiornare i prodotti (per impostare/cambiare la foto).
CREATE POLICY "admin aggiorna prodotti"
  ON prodotto FOR UPDATE TO authenticated USING (public.is_admin());
GRANT UPDATE ON prodotto TO authenticated;

-- Bucket pubblico in lettura: contiene foto prodotti e pagine di volantino.
INSERT INTO storage.buckets (id, name, public)
VALUES ('immagini', 'immagini', true)
ON CONFLICT (id) DO NOTHING;

-- Solo gli admin possono caricare immagini.
CREATE POLICY "admin carica immagini"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'immagini' AND public.is_admin());
