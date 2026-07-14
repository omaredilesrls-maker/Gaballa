-- DATI DI PROVA — NON sono prezzi veri.
--
-- Script opzionale per verificare il collegamento app <-> Supabase end-to-end:
-- crea un negozio per catena in zona Navigli (Milano) e replica i 10 prodotti
-- coi prezzi demo di app/src/data.ts. Eseguilo una volta sola (non è
-- idempotente) dopo la migrazione e il seed, dal SQL Editor del progetto.
--
-- Per rimuovere i prezzi di prova:
--   DELETE FROM prezzo WHERE riferimento_fonte = 'demo_data.sql';

INSERT INTO negozio (catena_id, nome, indirizzo, comune, cap, lat, lon)
SELECT c.id, v.nome, v.indirizzo, 'Milano', v.cap, v.lat, v.lon
FROM (VALUES
  ('Esselunga', 'Esselunga Milano Navigli', 'Viale Famagosta 75',    '20142', 45.4411, 9.1740),
  ('Conad',     'Conad Milano Navigli',     'Corso San Gottardo 29', '20136', 45.4591, 9.1740),
  ('Coop',      'Coop Milano Navigli',      'Via Palmieri 22',       '20141', 45.4330, 9.1740),
  ('Carrefour', 'Carrefour Milano Navigli', 'Via Vigevano 8',        '20144', 45.4519, 9.1945),
  ('Lidl',      'Lidl Milano Navigli',      'Via Lorenteggio 36',    '20146', 45.4789, 9.1740),
  ('Eurospin',  'Eurospin Milano Navigli',  'Via Giambellino 40',    '20146', 45.4519, 9.1433)
) AS v(catena, nome, indirizzo, cap, lat, lon)
JOIN catena c ON c.nome = v.catena;

INSERT INTO prodotto (nome, marca, quantita, unita_misura, categoria_id, iniziali)
SELECT v.nome, v.marca, v.quantita, v.unita::unita_misura, c.id, v.iniziali
FROM (VALUES
  ('Pasta Barilla',       'Barilla', 500::numeric, 'g',  'PA', 'Dispensa'),
  ('Latte Intero',        NULL,      1,            'l',  'LA', 'Latticini e Uova'),
  ('Pane in Cassetta',    NULL,      400,          'g',  'PN', 'Panetteria'),
  ('Uova Fresche',        NULL,      6,            'pz', 'UO', 'Latticini e Uova'),
  ('Olio Extra Vergine',  NULL,      1,            'l',  'OL', 'Dispensa'),
  ('Caffè Macinato',      NULL,      250,          'g',  'CA', 'Dispensa'),
  ('Acqua Naturale',      NULL,      9,            'l',  'AC', 'Bevande'),
  ('Mele Golden',         NULL,      1,            'kg', 'ME', 'Frutta e Verdura'),
  ('Petto di Pollo',      NULL,      500,          'g',  'PO', 'Carne e Pesce'),
  ('Detersivo Lavatrice', NULL,      2,            'l',  'DE', 'Cura Casa')
) AS v(nome, marca, quantita, unita, iniziali, categoria)
JOIN categoria c ON c.nome = v.categoria;

INSERT INTO prezzo (negozio_id, prodotto_id, prezzo, fonte, riferimento_fonte)
SELECT n.id, p.id, v.prezzo, 'feed_partner', 'demo_data.sql'
FROM (VALUES
  ('Esselunga', 'Pasta Barilla', 1.09), ('Conad', 'Pasta Barilla', 0.99), ('Coop', 'Pasta Barilla', 1.15), ('Carrefour', 'Pasta Barilla', 1.05), ('Lidl', 'Pasta Barilla', 0.89), ('Eurospin', 'Pasta Barilla', 0.85),
  ('Esselunga', 'Latte Intero', 1.35), ('Conad', 'Latte Intero', 1.29), ('Coop', 'Latte Intero', 1.42), ('Carrefour', 'Latte Intero', 1.25), ('Lidl', 'Latte Intero', 1.09), ('Eurospin', 'Latte Intero', 1.15),
  ('Esselunga', 'Pane in Cassetta', 1.79), ('Conad', 'Pane in Cassetta', 1.65), ('Coop', 'Pane in Cassetta', 1.89), ('Carrefour', 'Pane in Cassetta', 1.75), ('Lidl', 'Pane in Cassetta', 1.39), ('Eurospin', 'Pane in Cassetta', 1.49),
  ('Esselunga', 'Uova Fresche', 2.19), ('Conad', 'Uova Fresche', 1.99), ('Coop', 'Uova Fresche', 2.35), ('Carrefour', 'Uova Fresche', 2.05), ('Lidl', 'Uova Fresche', 1.79), ('Eurospin', 'Uova Fresche', 1.85),
  ('Esselunga', 'Olio Extra Vergine', 6.99), ('Conad', 'Olio Extra Vergine', 6.49), ('Coop', 'Olio Extra Vergine', 7.25), ('Carrefour', 'Olio Extra Vergine', 6.79), ('Lidl', 'Olio Extra Vergine', 5.99), ('Eurospin', 'Olio Extra Vergine', 6.15),
  ('Esselunga', 'Caffè Macinato', 3.49), ('Conad', 'Caffè Macinato', 3.19), ('Coop', 'Caffè Macinato', 3.65), ('Carrefour', 'Caffè Macinato', 3.29), ('Lidl', 'Caffè Macinato', 2.79), ('Eurospin', 'Caffè Macinato', 2.99),
  ('Esselunga', 'Acqua Naturale', 2.49), ('Conad', 'Acqua Naturale', 2.29), ('Coop', 'Acqua Naturale', 2.65), ('Carrefour', 'Acqua Naturale', 2.39), ('Lidl', 'Acqua Naturale', 1.99), ('Eurospin', 'Acqua Naturale', 2.05),
  ('Esselunga', 'Mele Golden', 1.99), ('Conad', 'Mele Golden', 1.79), ('Coop', 'Mele Golden', 2.15), ('Carrefour', 'Mele Golden', 1.89), ('Lidl', 'Mele Golden', 1.59), ('Eurospin', 'Mele Golden', 1.69),
  ('Esselunga', 'Petto di Pollo', 4.99), ('Conad', 'Petto di Pollo', 4.59), ('Coop', 'Petto di Pollo', 5.29), ('Carrefour', 'Petto di Pollo', 4.79), ('Lidl', 'Petto di Pollo', 4.19), ('Eurospin', 'Petto di Pollo', 4.39),
  ('Esselunga', 'Detersivo Lavatrice', 5.49), ('Conad', 'Detersivo Lavatrice', 4.99), ('Coop', 'Detersivo Lavatrice', 5.89), ('Carrefour', 'Detersivo Lavatrice', 5.19), ('Lidl', 'Detersivo Lavatrice', 4.49), ('Eurospin', 'Detersivo Lavatrice', 4.69)
) AS v(catena, prodotto, prezzo)
JOIN catena c ON c.nome = v.catena
JOIN negozio n ON n.catena_id = c.id AND n.nome LIKE '% Milano Navigli'
JOIN prodotto p ON p.nome = v.prodotto;
