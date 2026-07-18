-- Filtro Halal. Eseguire UNA VOLTA nel SQL Editor.
--
-- Ogni prodotto ha un flag "halal": l'app mostra SOLO i prodotti halal.
-- Default TRUE perché la stragrande maggioranza dei prodotti (pasta, latte,
-- frutta, verdura, dispensa...) è halal; si marcano a FALSE solo maiale,
-- alcolici (vino, birra, liquori) e carne/derivati non halal.

ALTER TABLE prodotto ADD COLUMN halal BOOLEAN NOT NULL DEFAULT TRUE;

-- Marca subito come NON halal gli eventuali prodotti già presenti il cui
-- nome/marca contiene parole chiave inequivocabili (maiale e alcolici).
-- \y = confine di parola, così "gin" non matcha "verGINe" né "rum" "RUMeno".
UPDATE prodotto SET halal = FALSE
WHERE lower(nome || ' ' || COALESCE(marca, '')) ~
  '\y(maiale|prosciutto|salame|salsiccia|pancetta|guanciale|mortadella|wurstel|w[üu]rstel|speck|lardo|cotechino|zampone|bacon|vino|vini|birra|birre|prosecco|spumante|liquore|liquori|whisky|vodka|rum|gin|grappa|aperitivo|spritz|champagne)\y';
