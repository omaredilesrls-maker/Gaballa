import { Catalog, DEFAULT_POSITION, Product, Store, haversineKm } from '../data';
import { supabase } from './supabase';

interface CatenaRow {
  id: string;
  nome: string;
  iniziali: string;
  colore: string;
}

interface NegozioRow {
  id: string;
  catena_id: string;
  lat: number;
  lon: number;
}

interface CategoriaRow {
  nome: string;
  colore_sfondo: string;
  colore_testo: string;
}

interface ProdottoRow {
  id: string;
  nome: string;
  quantita: number;
  unita_misura: string;
  iniziali: string;
  categoria: { nome: string } | null;
}

interface PrezzoRow {
  negozio_id: string;
  prodotto_id: string;
  prezzo_finale: number;
}

// '500g', '1L', '6 pz' — stesso formato delle etichette demo di data.ts.
function unitLabel(quantita: number, unita: string): string {
  const q = Number(quantita);
  const num = Number.isInteger(q) ? String(q) : String(q).replace('.', ',');
  if (unita === 'pz') return num + ' pz';
  if (unita === 'l') return num + 'L';
  if (unita === 'ml') return num + 'ml';
  return num + unita;
}

/**
 * Carica il catalogo (catene, prodotti, prezzi correnti) da Supabase e lo
 * mappa nel modello che le schermate già usano. Ritorna null quando non c'è
 * niente di utilizzabile — client non configurato, tabelle vuote, nessun
 * prezzo — così il chiamante resta sui dati demo locali.
 *
 * Nel modello dell'app ogni catena ha un prezzo per prodotto: qui prendiamo
 * il minimo tra i negozi della catena, e teniamo solo i prodotti prezzati in
 * tutte le catene così il confronto in lista resta onesto.
 */
export async function fetchCatalog(): Promise<Catalog | null> {
  if (!supabase) return null;

  const [catene, negozi, categorie, prodotti, prezzi] = await Promise.all([
    supabase.from('catena').select('id, nome, iniziali, colore'),
    supabase.from('negozio').select('id, catena_id, lat, lon').eq('attivo', true),
    supabase.from('categoria').select('nome, colore_sfondo, colore_testo'),
    supabase
      .from('prodotto')
      .select('id, nome, quantita, unita_misura, iniziali, categoria:categoria_id (nome)'),
    supabase.from('prezzo_effettivo').select('negozio_id, prodotto_id, prezzo_finale'),
  ]);

  const failed = [catene, negozi, categorie, prodotti, prezzi].find(r => r.error);
  if (failed?.error) throw failed.error;

  const catenaRows = (catene.data ?? []) as CatenaRow[];
  const negozioRows = (negozi.data ?? []) as NegozioRow[];
  const categoriaRows = (categorie.data ?? []) as CategoriaRow[];
  const prodottoRows = (prodotti.data ?? []) as unknown as ProdottoRow[];
  const prezzoRows = (prezzi.data ?? []) as PrezzoRow[];

  if (!catenaRows.length || !prezzoRows.length) return null;

  const catenaByNegozio = new Map(negozioRows.map(n => [n.id, n.catena_id]));

  // prodotto -> catena -> miglior prezzo tra i negozi della catena.
  const bestPrice = new Map<string, Map<string, number>>();
  for (const r of prezzoRows) {
    const catenaId = catenaByNegozio.get(r.negozio_id);
    if (!catenaId) continue;
    const perCatena = bestPrice.get(r.prodotto_id) ?? new Map<string, number>();
    const current = perCatena.get(catenaId);
    const price = Number(r.prezzo_finale);
    if (current == null || price < current) perCatena.set(catenaId, price);
    bestPrice.set(r.prodotto_id, perCatena);
  }

  const catenePrezzate = catenaRows.filter(c =>
    [...bestPrice.values()].some(perCatena => perCatena.has(c.id))
  );
  if (!catenePrezzate.length) return null;

  const stores: Store[] = catenePrezzate.map(c => {
    const coords = negozioRows
      .filter(n => n.catena_id === c.id)
      .map(n => ({ lat: n.lat, lon: n.lon }));
    return {
      id: c.id,
      name: c.nome,
      initials: c.iniziali,
      color: c.colore,
      distanceKm: coords.length
        ? Math.min(...coords.map(p => haversineKm(DEFAULT_POSITION, p)))
        : 0,
      coords,
    };
  });

  const products: Product[] = prodottoRows.flatMap(p => {
    const perCatena = bestPrice.get(p.id);
    if (!perCatena || !catenePrezzate.every(c => perCatena.has(c.id))) return [];
    const prices: Record<string, number> = {};
    for (const c of catenePrezzate) prices[c.id] = perCatena.get(c.id)!;
    return [
      {
        id: p.id,
        name: p.nome,
        unit: unitLabel(p.quantita, p.unita_misura),
        category: p.categoria?.nome ?? '',
        initials: p.iniziali,
        prices,
      },
    ];
  });

  if (!products.length) return null;

  return {
    stores,
    products,
    categories: categoriaRows.map(c => ({
      label: c.nome,
      bg: c.colore_sfondo,
      color: c.colore_testo,
    })),
  };
}
