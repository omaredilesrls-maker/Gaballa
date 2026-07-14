-- Dati statici già presenti in app/src/data.ts e app/src/theme.ts, riportati
-- identici così l'app esistente resta coerente col backend. Rieseguito ad
-- ogni `supabase db reset`, quindi solo dati di anagrafica idempotenti qui —
-- niente prezzi/negozi finti che poi verrebbero scambiati per dati veri.

INSERT INTO categoria (nome, colore_sfondo, colore_testo) VALUES
  ('Dispensa',          '#FDF1E0', '#C77F1A'),
  ('Latticini e Uova',  '#EAF3FF', '#2563AA'),
  ('Panetteria',        '#FBEFE6', '#B25E2A'),
  ('Bevande',            '#E7F5F0', '#0E8A6C'),
  ('Frutta e Verdura',  '#EFF7E6', '#5A8F1F'),
  ('Carne e Pesce',      '#FCEAEA', '#C23B3B'),
  ('Cura Casa',          '#EFEAFB', '#6B4FBF');

INSERT INTO catena (nome, iniziali, colore) VALUES
  ('Esselunga', 'ES', '#0B7A3B'),
  ('Conad',     'CN', '#A8123A'),
  ('Coop',      'CP', '#E0592B'),
  ('Carrefour', 'CF', '#0B5FA5'),
  ('Lidl',      'LI', '#D9A400'),
  ('Eurospin',  'EU', '#7C3AED');
