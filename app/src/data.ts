import { catColors } from './theme';
import { GeoPosition } from './lib/geocode';

export type StoreId = string;

export interface Store {
  id: StoreId;
  name: string;
  initials: string;
  color: string;
  // Distanza dal punto di riferimento di default (Milano Navigli); viene
  // ricalcolata con withDistances() quando l'utente sceglie una posizione.
  distanceKm: number;
  // Coordinate dei punti vendita della catena, per il ricalcolo.
  coords: GeoPosition[];
}

// Milano, zona Navigli: posizione usata finché l'utente non ne sceglie una.
export const DEFAULT_POSITION: GeoPosition = { lat: 45.4519, lon: 9.174 };

export function haversineKm(a: GeoPosition, b: GeoPosition): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/** Distanze ricalcolate dalla posizione dell'utente (negozio più vicino della catena). */
export function withDistances(stores: Store[], pos: GeoPosition | null): Store[] {
  if (!pos) return stores;
  return stores.map(s =>
    s.coords.length
      ? { ...s, distanceKm: Math.min(...s.coords.map(c => haversineKm(pos, c))) }
      : s
  );
}

export interface Product {
  id: string;
  name: string;
  unit: string;
  category: string;
  initials: string;
  prices: Record<StoreId, number>;
}

export interface Category {
  label: string;
  bg: string;
  color: string;
}

// Il set completo di dati che alimenta l'app: arriva da Supabase quando il
// progetto è collegato (vedi src/lib/catalog.ts), altrimenti dal demo qui sotto.
export interface Catalog {
  stores: Store[];
  products: Product[];
  categories: Category[];
}

// Le coordinate demo coincidono con i negozi di prova di supabase/demo_data.sql.
export const STORES: Store[] = [
  { id: 'esselunga', name: 'Esselunga', initials: 'ES', color: '#0B7A3B', distanceKm: 1.2, coords: [{ lat: 45.4411, lon: 9.174 }] },
  { id: 'conad', name: 'Conad', initials: 'CN', color: '#A8123A', distanceKm: 0.8, coords: [{ lat: 45.4591, lon: 9.174 }] },
  { id: 'coop', name: 'Coop', initials: 'CP', color: '#E0592B', distanceKm: 2.1, coords: [{ lat: 45.433, lon: 9.174 }] },
  { id: 'carrefour', name: 'Carrefour', initials: 'CF', color: '#0B5FA5', distanceKm: 1.6, coords: [{ lat: 45.4519, lon: 9.1945 }] },
  { id: 'lidl', name: 'Lidl', initials: 'LI', color: '#D9A400', distanceKm: 3.0, coords: [{ lat: 45.4789, lon: 9.174 }] },
  { id: 'eurospin', name: 'Eurospin', initials: 'EU', color: '#7C3AED', distanceKm: 2.4, coords: [{ lat: 45.4519, lon: 9.1433 }] },
];

export const PRODUCTS: Product[] = [
  { id: 'pasta', name: 'Pasta Barilla', unit: '500g', category: 'Dispensa', initials: 'PA', prices: { esselunga: 1.09, conad: 0.99, coop: 1.15, carrefour: 1.05, lidl: 0.89, eurospin: 0.85 } },
  { id: 'latte', name: 'Latte Intero', unit: '1L', category: 'Latticini e Uova', initials: 'LA', prices: { esselunga: 1.35, conad: 1.29, coop: 1.42, carrefour: 1.25, lidl: 1.09, eurospin: 1.15 } },
  { id: 'pane', name: 'Pane in Cassetta', unit: '400g', category: 'Panetteria', initials: 'PN', prices: { esselunga: 1.79, conad: 1.65, coop: 1.89, carrefour: 1.75, lidl: 1.39, eurospin: 1.49 } },
  { id: 'uova', name: 'Uova Fresche', unit: '6 pz', category: 'Latticini e Uova', initials: 'UO', prices: { esselunga: 2.19, conad: 1.99, coop: 2.35, carrefour: 2.05, lidl: 1.79, eurospin: 1.85 } },
  { id: 'olio', name: 'Olio Extra Vergine', unit: '1L', category: 'Dispensa', initials: 'OL', prices: { esselunga: 6.99, conad: 6.49, coop: 7.25, carrefour: 6.79, lidl: 5.99, eurospin: 6.15 } },
  { id: 'caffe', name: 'Caffè Macinato', unit: '250g', category: 'Dispensa', initials: 'CA', prices: { esselunga: 3.49, conad: 3.19, coop: 3.65, carrefour: 3.29, lidl: 2.79, eurospin: 2.99 } },
  { id: 'acqua', name: 'Acqua Naturale', unit: '6x1.5L', category: 'Bevande', initials: 'AC', prices: { esselunga: 2.49, conad: 2.29, coop: 2.65, carrefour: 2.39, lidl: 1.99, eurospin: 2.05 } },
  { id: 'mele', name: 'Mele Golden', unit: '1kg', category: 'Frutta e Verdura', initials: 'ME', prices: { esselunga: 1.99, conad: 1.79, coop: 2.15, carrefour: 1.89, lidl: 1.59, eurospin: 1.69 } },
  { id: 'pollo', name: 'Petto di Pollo', unit: '500g', category: 'Carne e Pesce', initials: 'PO', prices: { esselunga: 4.99, conad: 4.59, coop: 5.29, carrefour: 4.79, lidl: 4.19, eurospin: 4.39 } },
  { id: 'detersivo', name: 'Detersivo Lavatrice', unit: '2L', category: 'Cura Casa', initials: 'DE', prices: { esselunga: 5.49, conad: 4.99, coop: 5.89, carrefour: 5.19, lidl: 4.49, eurospin: 4.69 } },
];

export const DEMO_CATALOG: Catalog = {
  stores: STORES,
  products: PRODUCTS,
  categories: Object.keys(catColors).map(label => ({
    label,
    bg: catColors[label].bg,
    color: catColors[label].color,
  })),
};

const FALLBACK_CAT = { bg: '#EEF1EC', color: '#6B7A72' };

export function eur(n: number): string {
  return '€' + n.toFixed(2).replace('.', ',');
}

export function storesSortedFor(product: Product, stores: Store[]) {
  return stores
    .filter(s => product.prices[s.id] != null)
    .map(s => ({ store: s, price: product.prices[s.id] }))
    .sort((a, b) => a.price - b.price);
}

export interface EnrichedProduct extends Product {
  tileBg: string;
  tileColor: string;
  minPriceLabel: string;
  minStoreName: string;
  savingsLabel: string;
  savingsPct: number;
  savingsPctLabel: string;
}

export function enrichProduct(product: Product, catalog: Catalog): EnrichedProduct {
  const sorted = storesSortedFor(product, catalog.stores);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const savingsPct = max.price > 0 ? Math.round(((max.price - min.price) / max.price) * 100) : 0;
  const cat =
    catalog.categories.find(c => c.label === product.category) ?? FALLBACK_CAT;
  return {
    ...product,
    tileBg: cat.bg,
    tileColor: cat.color,
    minPriceLabel: eur(min.price),
    minStoreName: min.store.name,
    savingsLabel: eur(max.price - min.price),
    savingsPct,
    savingsPctLabel: savingsPct + '%',
  };
}
