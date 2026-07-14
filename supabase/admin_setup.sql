-- Ruolo amministratore + permessi per l'inserimento prezzi dal pannello admin.
-- Eseguire UNA VOLTA nel SQL Editor, DOPO la migrazione iniziale.
--
-- Poi, per promuovere il tuo utente ad admin (dopo averlo creato in
-- Authentication > Users), esegui — con la tua email al posto di quella d'esempio:
--
--   UPDATE profilo SET ruolo = 'admin'
--   WHERE id = (SELECT id FROM auth.users WHERE email = 'tua@email.it');

ALTER TABLE profilo ADD COLUMN ruolo TEXT NOT NULL DEFAULT 'utente';

-- SECURITY DEFINER: la funzione legge profilo anche se il chiamante non
-- potrebbe, così le policy possono usarla senza aprire la tabella.
CREATE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM profilo WHERE id = auth.uid() AND ruolo = 'admin');
$$;

CREATE POLICY "admin inserisce prezzi"
  ON prezzo FOR INSERT TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "admin inserisce prodotti"
  ON prodotto FOR INSERT TO authenticated WITH CHECK (public.is_admin());

GRANT INSERT ON prezzo, prodotto TO authenticated;
-- La colonna id di prezzo è BIGSERIAL: l'insert usa la sequence.
GRANT USAGE ON SEQUENCE prezzo_id_seq TO authenticated;
